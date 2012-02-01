var TC_ENCODING = 'aZbYcXdWeVfUgThSiRjQkPlOmNnMoLpKqJrIsHtGuFvEwDxCyBzA0123456789_=+-.';
var CLASS_MAP = {
	1: 'warrior',
	2: 'paladin',
	3: 'hunter',
	4: 'rogue',
	5: 'priest',
	6: 'death-knight',
	7: 'shaman',
	8: 'mage',
	9: 'warlock',
	11: 'druid'
};
var PET_MAP = {
	0: 'ferocity',
	1: 'tenacity',
	2: 'cunning'
};

function TalentCalculator(options) {

	// Variables
	var self = this;
	TalentCalculator.instances[options.id] = self;

		// Options
		var hash;
		var data;
		var calculatorMode = false;
		var petMode = false;
		var glyphMode = false;
		
		// Mode-based
		var pointsPerTier;
		var specializationPoints;
		var basePoints;
		var extraPoints;
		var totalPoints;

		// State
		var pointsSpent = 0;
		var processingBuild = false;
		var locked;
		var specialization;
		var overviewPaneVisible = true;
		var dataLoaded = false;
		var updating = false;

		// Pet-specific stuff
		var singleTreeNo;
		var petId;
		var petCategoryFlag;
		var petCategoryMaskName;
		
		// Helper
		var allTalents = {};
		var allSpells = {};
		var allPetFamilies = {};
		var allGlyphs = {};

		// Glyphs
		var glyphs = [];
		var glyphMap = {};
		var glyphCounts = {};
		var chosenGlyphs = {};

		// Export
		var exportGlyph = '';
		var exportUrl = '';
		var importing = false;
		var exporting = false;

		// DOM nodes
		var $talentCalc;
		var $chooseText;
		var $info;
		var $pointsSpent;
		var $pointsSpentValue;
		var $requiredLevel;
		var $requiredLevelValue;
		var $pointsLeft;
		var $pointsLeftValue;
		var $export;
		var $exportFields;
		var $reset;
		var $calcMode;
		var $restore;
		var $toggleOverviewPane;
		var $beastMastery;
		var $glyphs;
		var $glyphSelector;

	// Constants
	var NUM_TREES = 3;
	var MAX_LEVEL = 85;
	var BUILD_SEP = '!';

	// Constructor
	init();

	// Public functions
	self.receiveData = function(d) {
		data = d.talentData.talentTrees;
		glyphs = d.glyphs;

		initData();
			initGlyphs();
		initHtml();
		lock();

		overviewPaneVisible = (!petMode && options.calculatorMode && !options.build); // Initial state

		if(options.build) {
			processBuild(options.build);		

		} else if (hash = Core.getHash()) {
			importDecode();
			
		} else {
			setSpecialization(-1);
		}

		updateAllTrees();
		dataLoaded = true;
		
		if (options.callback)
			options.callback(self);
	};

	self.setPetFamilyId = function(id, loading) {
		var petFamily = allPetFamilies[id];

		if (!petFamily || updating) {
			return;	
		}

		setPetView(petFamily);

		if (!loading)
			reset();
		
		updateAllTrees();
		exportData();
	};
	
	self.setBuild = function(build) {
		options.build = build;	

		if(dataLoaded) {
			processBuild(build);
			lock();
			updateAllTrees();
		}
	};

	self.enable = function() {
		enterCalculatorMode();
	}

	self.disable = function() {
		exitCalculatorMode();
	}

	self.exportBuild = function() {
		exportData();
	}

	// Private functions
	function init() {
		calculatorMode = options.calculatorMode;
		petMode = options.petMode;
		glyphMode = options.glyphMode;

		initModeVariables();

		var url = Core.baseUrl + '/talents/' + (petMode ? 'pet' : 'class/' + options.classId); // + '?jsonp=TalentCalculator.instances.' + options.id + '.receiveData';

		if($.browser.msie) {
			url += '?'+ (+new Date);
		}

		$.ajax({
			url: url,
			dataType: 'json',
			success: function(json) {
				TalentCalculator.instances[options.id].receiveData(json);
	}
		});
	}

	function initModeVariables() {
		
		if(petMode) {
			pointsPerTier = 3;
			specializationPoints = 0;
			setPoints(17, 0);
		} else {
			pointsPerTier = 5;
			specializationPoints = 31;
			setPoints(41, 0);
		}
	}

	function initData() {
		for(var treeNo = 0; treeNo < NUM_TREES; ++treeNo) {
			
			var tree    = data[treeNo];
			var talents = tree.talents;

			tree.points = 0;
			tree.treeNo = treeNo;

			$.each(talents, function(idx) {
				
				this.points     = 0;
				this.tree       = data[treeNo];
				this.talentNo   = idx;
				this.treeNo     = treeNo;
				this.max        = this.ranks.length;
				this.dependants = [];

				if(petMode) {
					this.hasCategoryMask = !!(this.categoryMask0 || this.categoryMask1);
				}

				allTalents[this.id] = this;
			});

			$.each(tree.primarySpells, function() {
				allSpells[this.spellId] = this;
			});
			$.each(tree.masteries, function() {
				allSpells[this.spellId] = this;
			});

			if(tree.petFamilies) {
				$.each(tree.petFamilies, function() {
					allPetFamilies[this.familyId] = this;
				});
			}

			// 2nd pass once allTalents is initialized
			$.each(talents, function() {
				
				if(this.req) {
					this.req = allTalents[this.req]; // Convert talent IDs to direct references
					this.req.dependants.push(this);
				}
			});
		}
	}
	
	function initGlyphs() {
		if (!glyphMode)
			return;
		
		var prime = [],
			major = [],
			minor = [];

		for (var i = 0, glyph; glyph = glyphs[i]; i++) {
			if (glyph.type == 0)
				major.push( glyph );
			
			else if (glyph.type == 1)
				minor.push( glyph );

			else if (glyph.type == 2)
				prime.push( glyph );
		}

		var sort = function(a, b) {
			var x = a.name,
				y = b.name;

			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		}

		major = major.sort(sort);
		minor = minor.sort(sort);
		prime = prime.sort(sort);

		allGlyphs = [
			major,
			minor,
			prime
		];
	}
	
	function initHtml() {
		$talentCalc = $('#talentcalc-' + options.id);

		if(petMode) {
			$talentCalc.addClass('talentcalc-pet');
		}

		// "Choose a spec" text
		$chooseText = $talentCalc.children('div.talentcalc-choosetext');

		// Talent trees
		var $treeWrappers = $talentCalc.children('div.talentcalc-tree-wrapper');
		for(var treeNo = 0; treeNo < NUM_TREES; ++treeNo) {

			var tree = data[treeNo];

			var $treeWrapper = $($treeWrappers.get(treeNo));

			var $treeHeader   = $treeWrapper.children('div.talentcalc-tree-header');
			var $points       = $treeHeader.children('span.points');
			var $tree         = $treeWrapper.children('div.talentcalc-tree');
			var $treeOverview = $treeWrapper.children('div.talentcalc-tree-overview');
			var $button       = $treeWrapper.children('div.talentcalc-tree-button');
			var $cellsWrapper = $tree.children('div.talentcalc-cells-wrapper');
			var $cells        = $cellsWrapper.children('div');

			tree.$treeWrapper  = $treeWrapper;
			tree.$treeHeader   = $treeHeader;
			tree.$points       = $points;
			tree.$tree         = $tree;
			tree.$treeOverview = $treeOverview;
			tree.$button       = $button;

			$button
				.bind('click', { treeNo: treeNo }, treeButtonClick)
				.find('button').removeClass('disabled').removeAttr('disabled');

			//$treeOverview.children('ul.spells').delegate('li', 'mouseover', overviewSpellMouseOver);

			$cellsWrapper.delegate('a.interact', 'mouseover',   iconMouseOver);
			$cellsWrapper.delegate('a.interact', 'mouseout',    iconMouseOut);
			$cellsWrapper.delegate('a.interact', 'mousedown',   iconMouseDown);
			$cellsWrapper.delegate('a.interact', 'contextmenu', iconContextMenu);

			$cells.each(function() {

				var talent = getTalentFromCell(this);
				var $cell = $(this);

				talent.$cell     = $cell;
				talent.$icon     = $cell.children('span.icon');
				talent.$points   = $cell.children('span.points').children('span.value');
				talent.$interact = $cell.children('a.interact');
				
				if(talent.req) {
					talent.$arrow = $cell.children('span.arrow');
				}
			});
		}

		$exportFields = $talentCalc.children('div.talentcalc-export');

		// glyphs
		$glyphSelector = $talentCalc.children('div.talentcalc-glyphselector');
		$glyphSelector.find('a.close').click(closeGlyphSelector);
		$glyphs = $talentCalc.children('div.talentcalc-glyphs');
		$glyphs.find('a.glyph').click(openGlyphSelector);
		$glyphs.find('a.close').click(emptyGlyph);

		// Info
		var $top = $talentCalc.children('div.talentcalc-top');
		$info = $top.children('div.talentcalc-info');
		$pointsSpent        = $info.children('div.pointsspent');
		$pointsSpentValue   = $pointsSpent.children('span.value');
		$requiredLevel      = $info.children('div.requiredlevel');
		$requiredLevelValue = $requiredLevel.children('span.value');
		$pointsLeft         = $info.children('div.pointsleft');
		$pointsLeftValue    = $pointsLeft.children('span.value');
		$export             = $info.children('div.export');
		$restore            = $info.children('div.restore');
		$reset				= $info.children('div.reset');

		$reset.children('button').click(reset);
		$restore.children('a').click(exitCalculatorMode);

		// Buttons
		var $bottom = $talentCalc.children('div.talentcalc-bottom');
		var $buttons = $bottom.children('div.talentcalc-buttons');

		$beastMastery = $bottom.children('div.beastmastery');
		$beastMastery.mouseover(beastMasteryMouseOver).find('input').click(toggleBeastMastery);

		$calcMode = $bottom.children('div.calcmode');
		$calcMode.children('a').click(jumpToCalculator);

		$toggleOverviewPane = $buttons.find('button');
		$toggleOverviewPane.click(toggleOverviewPane);
	}

	function processBuild(build) {
		processingBuild = true;

		resetAllTrees();

		// Remove any bonus points
		setPoints(null, 0);

		if(build.match(/^\d+/)) {
			processLongBuild(build);
		}

		processingBuild = false;

		// Set specialization based on points spent
		if(specializationPoints && pointsSpent > 0 && specialization == null) {
			var maxTreePoints = 0;
			var maxTreeNo = -1;
			for(var treeNo = 0; treeNo < NUM_TREES; ++treeNo) {
				var tree = data[treeNo];
				if(tree.points > maxTreePoints) {
					maxTreePoints = tree.points;
					maxTreeNo = treeNo;	
				}
			}
			if(maxTreeNo != -1) {
				setSpecialization(maxTreeNo);
			}
		}
	
	}

	function processLongBuild(build) {

		var pos = 0;

		for(var treeNo = 0; treeNo < NUM_TREES; ++treeNo) {
			
			var talents = data[treeNo].talents;

			$.each(talents, function() {
				
				var talent = this;
				
				if(pos >= build.length)
					return;
				
				var points = parseInt(build.charAt(pos));
				if(points > 0) {
					
					// Auto-add 4 extra points from Beast Mastery
					if(petMode && extraPoints == 0) {
						var pointsLeft = totalPoints - pointsSpent;
						if(points > pointsLeft) {
							setPoints(null, 4);
						}
					}
					
					addPointsToTalent(talent, points);
				}

				++pos;
			});
		}
	}

	function lock() {
		locked = true;
		$talentCalc.addClass('talentcalc-locked');
	}

	function unlock() {
		locked = false;
		$talentCalc.removeClass('talentcalc-locked');
	}

	function toggleLock() {
		if(locked) {
			unlock();
		}
		else {
			lock();
		}
		updateAllTrees();
	};

	function updateAllTrees() {
		updating = true;
		
		if(singleTreeNo) {
			updateTree(data[singleTreeNo]);
		} else {
			for(var treeNo = 0; treeNo < NUM_TREES; ++treeNo) {
				var tree = data[treeNo];
				updateTree(tree);
			};
		}

		updateInfo();

		// Specialization
		if(specializationPoints) {

			if(calculatorMode) {
				if(specialization != null) {
					setOverviewPane(false);
				} else {
					lock();
					setOverviewPane(true);
				}
			}
			
			for(var treeNo = 0; treeNo < NUM_TREES; ++treeNo) {
				var tree = data[treeNo];

				tree.$treeWrapper.removeClass('tree-specialization tree-nonspecialization');

				if(specialization != null) {

					tree.$treeHeader.css('visibility', 'visible');
					tree.$button.hide();

					if(treeNo == specialization) {
						tree.$treeWrapper.addClass('tree-specialization');
					} else {
						tree.$treeWrapper.addClass('tree-nonspecialization');
					}
				} else {
					if(calculatorMode) {
						tree.$treeHeader.css('visibility', 'hidden');
						tree.$button.show();
					}
				}
			}
		}

		updating = false;
	}

	function updateTree(tree) {

		tree.$points.text(tree.points);

		if(specializationPoints) {

			if(specialization == null || (tree.treeNo != specialization && data[specialization].points < specializationPoints)) {
				tree.locked = true;
				tree.$treeWrapper.addClass('tree-locked');
			} else {
				tree.locked = false;
				tree.$treeWrapper.removeClass('tree-locked');
			}
		}

		$.each(tree.talents, function() {
			this.enabled = doesTalentValidate(this);

			if(!this.enabled && this.points) {
				this.points = 0;
			}

			this.visible = isTalentVisible(this);

			updateTalentDisplay(this);
		});

	}

	function updateInfo() {
		if (petMode) {
			$pointsSpentValue.text(pointsSpent);
		} else {
		$pointsSpentValue.children('span').text(function(treeNo) {
			return data[treeNo].points;
		});
		}
		
		$requiredLevelValue.text(getRequiredLevel());
		$pointsLeftValue.text(totalPoints - pointsSpent);
	}

	function resetAllTrees() {

		for(var treeNo = 0; treeNo < NUM_TREES; ++treeNo) {
			var tree = data[treeNo];
			resetTree(tree);
		};

		if(specializationPoints) {
			setSpecialization(-1);
	}
	}

	function resetTree(tree) {
		pointsSpent -= tree.points;
		tree.points = 0;
		$.each(tree.talents, function() {
			this.points = 0;
		});
	}

	function reset() {
		resetAllTrees();
		resetGlyphs();
		toggleBeastMastery();
		location.replace('#reset');
		exportUrl = '';
		exportGlyph = '';
		updateAllTrees();
		updateInfo();
	}

	function setOverviewPane(visibility) {
		overviewPaneVisible = visibility;
		updateOverviewPane();
	}

	function toggleOverviewPane() {
		overviewPaneVisible = !overviewPaneVisible;
		updateOverviewPane();
	}

	function updateOverviewPane() {
		for(var treeNo = 0; treeNo < NUM_TREES; ++treeNo) {
			var tree = data[treeNo];

			if(overviewPaneVisible) {
				tree.$treeOverview.show();
			} else {
				tree.$treeOverview.hide();
			}
		}

		$toggleOverviewPane.find('span span').text(overviewPaneVisible ? MsgTalentCalculator.buttons.overviewPane.hide : MsgTalentCalculator.buttons.overviewPane.show);

		if(overviewPaneVisible) {
			$glyphs.addClass('locked');
		} else {
			$glyphs.removeClass('locked');
	}
		
		closeGlyphSelector();
	}

	function doesTalentValidate(talent)
	{
		// Enough points spent in tree?
		if(talent.tree.points < getReqPointsInTree(talent)) {
			return false;
		}

		// Check required talent (if any)
		if(talent.req && talent.req.points < talent.req.max) {
			return false;
		}
		// Talent specialization
		if(!processingBuild) {
			if(talent.tree.locked) {
				return false;
			}
		}

		return true;
	}

	function isTalentVisible(talent) {

		if(petMode && talent.hasCategoryMask) {
					
			return !!(petCategoryFlag & talent[petCategoryMaskName]);
		}

		return true;

	}

	function updateTalentDisplay(talent) {

		var active = talent.enabled;
		if((locked || pointsSpent >= totalPoints) && talent.points == 0)
			active = false;

		talent.$cell.removeClass('talent-partial talent-full talent-arrow');

		if(active) {

			if(talent.points < talent.max) {
				talent.$cell.addClass('talent-partial');
			} else {
				talent.$cell.addClass('talent-full');
			}
			
			if(talent.req)
				talent.$cell.addClass('talent-arrow');
		
		} else {


		}

		// Override the baked background for cells where the displayed talent varies (e.g. Dash vs. Dive)
		if(petMode && talent.hasCategoryMask) {
			talent.$icon.css('background', active ? 'url(' + Wow.Icon.getUrl(talent.icon, 36) + ') 0 0 no-repeat' : 'none');
		}

		if(talent.visible) {
			talent.$cell.show();	
		} else {
			talent.$cell.hide();	
		}
	
		talent.$points.text(talent.points);
	}

	function addPointsToTalent(talent, points) {
		var pointsLeft = totalPoints - pointsSpent;
	
		if(
			pointsLeft == 0 ||
			points <= 0 ||
			talent.points >= talent.max // Talent already maxed out
		)
			return false;

		if(points > pointsLeft) { // Not enough points to spend
			points = pointsLeft;
		}

		if(talent.points + points >= talent.max) // Cap at maximum rank
			points = (talent.max - talent.points);

		if(!processingBuild) { // Additional validation is disabled while processing a talent build
			if(!talent.enabled)
				return false;
		}

		talent.points      += points;
		talent.tree.points += points;
		pointsSpent        += points;
		
		return true;
	}

	function removePointFromTalent(talent) {
	
		if(talent.points <= 0) // Already empty
			return false;

		if(specializationPoints && specialization != null && specialization == talent.tree.treeNo) {
			// Don't allow unspecializing if there are still points in the other trees
			var pointsSpentInMainTree = data[specialization].points;
			if(pointsSpentInMainTree == specializationPoints && pointsSpent > pointsSpentInMainTree) {
				return false;	
			}
		}

		// Check talents on deeper tiers to see if removing a point would break them
		var brokenTalent = false;
		$.each(talent.tree.talents, function() {
			if(this.points > 0 && this.y > talent.y) {
				if(!testTalentAfterRemoval(this)) {
					brokenTalent = true;
					return false;
				}
			}
		});
		if(brokenTalent) {
			return false;
		}

		// All talents that require the current one must be empty
		var dependencyFound = false;
		$.each(talent.dependants, function() {
			if(this.points > 0) {
				dependencyFound = true;
				return false;
			}
		});
		if(dependencyFound) {
			return false;
		}

		talent.points      -= 1;
		talent.tree.points -= 1;
		pointsSpent        -= 1;
		
		return true;
	}

	function testTalentAfterRemoval(talent) {

		var reqPointsInTree = getReqPointsInTree(talent);

		var pointsInPreviousTiers = 0;
		$.each(talent.tree.talents, function() {
			if(this.y < talent.y) {
				pointsInPreviousTiers += this.points;
			}
		});

		return (pointsInPreviousTiers - 1) >= reqPointsInTree;;
	}

	function showTalentTooltip(talent) {

		var $tooltip = $('<ul/>');

		// Name
		$('<li/>').append($('<h3/>').text(talent.name)).appendTo($tooltip);
		
		// Rank
		$('<li/>').text(Core.msg(MsgTalentCalculator.talents.tooltip.rank, talent.points, talent.max)).appendTo($tooltip);

		// Warnings
		var enabled = (talent.enabled && !locked);
		if(!enabled) {
			
			if(talent.tree.locked) {
				$('<li/>', { "class": 'color-tooltip-red', text: Core.msg(MsgTalentCalculator.talents.tooltip.primaryTree, specializationPoints) }).appendTo($tooltip);
			}
			
			var reqPointsInTree = getReqPointsInTree(talent);
			if(talent.tree.points < reqPointsInTree) {
				$('<li/>', { "class": 'color-tooltip-red', text: Core.msg(MsgTalentCalculator.talents.tooltip.reqTree, reqPointsInTree, talent.tree.name) }).appendTo($tooltip);
			}
	
			if(talent.req && talent.req.points < talent.req.max) {
				$('<li/>', { "class": 'color-tooltip-red', text: Core.msg(MsgTalentCalculator.talents.tooltip.reqTalent, talent.req.max, talent.req.name) }).appendTo($tooltip);
			}
		}

		var currentRank = talent.ranks[Math.max(0, talent.points - 1)];

		appendSpellDescription($tooltip, currentRank);

		// Next rank
		if(!locked && talent.points > 0 && talent.points < talent.max) {
			$('<li/>').text(MsgTalentCalculator.talents.tooltip.nextRank).prepend($('<br/>')).appendTo($tooltip);
			$('<li/>', { "class": 'color-tooltip-yellow', text: talent.ranks[talent.points].description }).appendTo($tooltip);
		}

		// Interactivity
		if(enabled) {
			if(talent.points < talent.max) {
				$('<li/>', { "class": 'color-tooltip-green', text: MsgTalentCalculator.talents.tooltip.click }).appendTo($tooltip);
			} else {
				$('<li/>', { "class": 'color-tooltip-red', text: MsgTalentCalculator.talents.tooltip.rightClick }).appendTo($tooltip);
			}
		
		}

		Tooltip.show(talent.$interact, $tooltip);
	}

	function appendSpellDescription($tooltip, spell) {

		// Cost + Range
		if(spell.cost || spell.range) {
			var $line = $('<li/>');
			if(spell.range) {
				if(spell.cost) {
					$('<span/>', { "class": 'float-right', text: spell.range }).appendTo($line);
				} else {
					$line.text(spell.range);
				}
			}
			if(spell.cost) {
				$line.append(spell.cost);
			}
			$line.appendTo($tooltip);
		}

		// Cast time + Cooldown
		if(spell.castTime || spell.cooldown) {
			var $line = $('<li/>');
			if(spell.cooldown) {
				if(spell.castTime) {
					$('<span/>', { "class": 'float-right', text: spell.cooldown }).appendTo($line);
				} else {
					$line.text(spell.cooldown);
				}
			}
			if(spell.castTime) {
				$line.append(spell.castTime);
			}
			$line.appendTo($tooltip);
		}

		// "Requires ..." line
		if(spell.requires) {
			$('<li/>').text(spell.requires).appendTo($tooltip);
		}

		// Description
		$('<li/>', { 'class': 'color-tooltip-yellow', html: spell.description.replace(/\n\n/g, '<br />') }).appendTo($tooltip);
	}

	function getRequiredLevel() {
		var currentGlyphLevel = glyphRequiredLevel();

		if (!pointsSpent && currentGlyphLevel == 0)
			return '-';

		var level = 0;

		if(petMode) {
			level = 20 + (pointsSpent - 1) * 4;

		} else { // Character mode

			var reqLevel = 9;
			var points = pointsSpent;

			// First 2 points = every 1 level
			var part = Math.min(2, points);
			if(part > 0) {
				reqLevel += part;
				points -= part;
			}
			
			// Next 35 points = every 2 levels
			part = Math.min(35, points);
			if(part > 0) {
				reqLevel += part * 2;
				points -= part;
			}

			// Last 4 points = every 1 level
			part = Math.min(5, points);
			if(part > 0) {
				reqLevel += part;
				points -= part;
			}
			
			level = reqLevel;
		}
	
		if (level > MAX_LEVEL) {
			level = MAX_LEVEL;

		} else if (level < currentGlyphLevel) {
			level = currentGlyphLevel;
	}

		return level;
	}

	function setPetView(petFamily) {
		
		showSingleTree(petFamily.petTypeId);
		
		var bit = petFamily.categoryBit;
		
		if(bit >= 32) {
			bit -= 32;
			petCategoryMaskName = 'categoryMask1';
		} else {
			petCategoryMaskName = 'categoryMask0';
		}

		petCategoryFlag = (1 << bit);
		petId = petFamily.familyId;
	}

	function showSingleTree(no) {
		singleTreeNo = no;
		
		for(var treeNo = 0; treeNo < NUM_TREES; ++treeNo) {
			var $treeWrapper = data[treeNo].$treeWrapper;
			if(treeNo == no) {
				$treeWrapper.show();
			} else {
				$treeWrapper.hide();
			}
		}

		$talentCalc.show();
	}

	function enterCalculatorMode() {

		calculatorMode = true;
		unlock();
		updateAllTrees();

			$pointsSpent.show();
			$requiredLevel.show();
			$pointsLeft.show();
		$reset.show();
		$calcMode.hide();

		if (petMode) {
			$beastMastery.show();
		} else {
			$beastMastery.hide();
		}

		if(specializationPoints && pointsSpent == 0) {
			setSpecialization(-1);
		}
	}

	function exitCalculatorMode() {

		calculatorMode = false;
		if(options.build) {
			processBuild(options.build);
		}
		lock();
		updateAllTrees();

		$pointsSpent.hide();
		$requiredLevel.hide();
		$pointsLeft.hide();
		$reset.hide();
		$calcMode.show();
		$restore.hide();
	}

	function toggleBeastMastery(e, enable) {
		if (!petMode)
			return;
		
		var input = $('#beastMastery');

		if (enable || this.checked) {
			if (input.length)
				input[0].checked = true;

			setPoints(null, 4);
			
		} else {
			if (input.length)
				input[0].checked = false;
			
			setPoints(null, 0);

			if (pointsSpent > 17) {
				var talents = data[singleTreeNo].talents,
					talent,
					threshold = (pointsSpent - 17),
					removed = 0;

				for (var i = (talents.length - 1); i >= 0; i--) {
					if (removed >= threshold)
						break;

					talent = talents[i];

					if (talent.points <= 0) {
						continue;
					} else {
						var pointsToRemove = talent.points;

						if ((pointsToRemove + removed) > threshold)
							pointsToRemove = (pointsToRemove - removed);

						for (var x = 0; x < pointsToRemove; x++) {
							removePointFromTalent(talent);
							removed++;
						}
					}
				}
			}
		}

		exportData();
		updateAllTrees();
	}

	function jumpToCalculator() {
		Core.goTo('/tool/'+ (petMode ? 'pet' : 'talent') +'-calculator#'+ exportData(true), true);
	}

	function exportData(returnHash) {
		if (importing || exporting)
			return;

		exporting = true;

		exportTalents();
		exportGlyphs();

		var hash = exportUrl + exportGlyph;

		exporting = false;

		if (returnHash)
			return hash;
		else
			location.replace('#'+ hash);
	}

	function exportTalents() {
		var points = {
				'0': [],
				'1': [],
				'2': []
			};

		$.each(data, function() {
			$.each(this.talents, function(index, talent) {
				points[this.treeNo].push(talent.points);
			});
		});

		// Build the export strings
		var hash = [],
			hashFormat;

		for (var i = 0; i < NUM_TREES; ++i) {
			hashFormat = '';

			for (var p = 0; p < points[i].length; ++p) {
				hashFormat = hashFormat + points[i][p];
			}

			hash.push(encode(rtrim(hashFormat, '0')));
		}

		if (petMode)
			exportUrl = TC_ENCODING.charAt(petId) +'p'+ (extraPoints || 0) + (singleTreeNo || 0);
		else
			exportUrl = TC_ENCODING.charAt(options.classId) +'c'+ (extraPoints || 0) + (specialization || 0);

		exportUrl += BUILD_SEP + hash.join(BUILD_SEP);
	}

	function exportGlyphs() {
		var str = '',
			ids = [];

		if (options.glyphs && options.glyphs.length) {
			ids = options.glyphs;
		} else {
		for (var i = 0; i < 3; i++) {
			for (var x = 0; x < 3; x++) {
				if (glyphMap[i +'-'+ x]) {
					ids.push( glyphMap[i +'-'+ x] );
				}
			}
		}
		}

		if (ids.length) {
			$.each(glyphs, function(key, value) {
				for (var g = 0; g < ids.length; g++) {
					if (ids[g] == value.id) {
						str += TC_ENCODING.charAt(key);
						return true;
					}
				}
			});

			exportGlyph = BUILD_SEP + str;
		}
	}

	function encode(points) {
		var hash = '';

		for (var i = 0; i < points.length; i += 2) {
			var values = [];

			for (var j = 0; j < 2; ++j) {
				values[j] = parseInt(points.substr(i + j, 1));

				if (isNaN(values[j]))
					values[j] = 0;
			}

			hash += TC_ENCODING.charAt((values[0] * 6) + values[1]);
		}

		return hash;
	}

	function importDecode() {
		if (!hash || hash.indexOf(BUILD_SEP) < 0)
			return;

		var build = hash.split(BUILD_SEP),
			id = TC_ENCODING.indexOf(build[0].charAt(0));

		// Set class properties
		importing = true;
		calculatorMode = glyphMode = (build[0].charAt(1) == 'c');
		petMode = (build[0].charAt(1) == 'p');
		extraPoints = build[0].charAt(2);

		if (!petMode && id != options.classId) {
			importing = false;
			return;
		}

		enterCalculatorMode();

		if (petMode) {
			self.setPetFamilyId(id, true);
		} else {
			treeButtonClick({ data: { treeNo: build[0].charAt(3) }});
		}

		if (petMode && extraPoints >= 1) {
			toggleBeastMastery(null, true);
		}

		// Decode points per talent tree
		var tree,
			points,
			primary = -1,
			values = [],
			trees = [];

		for (var i = 1; i < 4; ++i) {
			if (!build[i] || build[i] == '') {
				trees[(i - 1)] = '';
				continue;
			}

			tree = build[i];
			points = '';

			for (var t = 0; t < tree.length; ++t) {
				var n = TC_ENCODING.indexOf(tree.charAt(t));

				if (n < 0)
					continue;

				values[1] = n % 6;
				values[0] = (n - values[1]) / 6;

				for (var j = 0; j < 2; ++j) {
					points += values[j];
				}
			}
			
			trees[(i - 1)] = points;

			if (points.length >= trees[(primary == -1 ? 0 : primary)].length)
				primary = (i - 1);
		}

		// Glyph data
		if (build[4])
			importGlyphs(build[4]);

		// Set the points
		if (primary > -1) {
			processingBuild = true;

			// Load primary then secondary
			importPoints(primary, trees[primary]);

			for (var b = 0; b < NUM_TREES; ++b) {
				if (b != primary)
					importPoints(b, trees[b]);
			}

			processingBuild = false;
		}
		
		importing = false;
	}

	function importPoints(treeNo, build) {
		for (var c = 0; c < build.length; ++c) {
			addPointsToTalent(data[treeNo].talents[c], parseInt(build.charAt(c)));
		}
	}

	function importGlyphs(build) {
		var prime = 0,
			major = 0,
			minor = 0,
			index = 0,
			glyph;

		for (var i = 0; i < build.length; i++) {
			glyph = glyphs[TC_ENCODING.indexOf(build.charAt(i))];

			if (!glyph)
				return;

			if (glyph.type == 0) {
				index = major;
				major++;
				
			} else if (glyph.type == 1) {
				index = minor;
				minor++;
				
			} else if (glyph.type == 2) {
				index = prime;
				prime++;
			}

			chooseGlyph(glyph.id, glyph.type, index);
			replaceGlyph(
				$glyphs.find('.glyph-'+ glyph.type +' li:eq('+ (index + 1) +') a.glyph'),
				createGlyphNode(glyph)
			);
		}
	}

	function rtrim(str, charlist) {
		charlist = !charlist ? ' \\s\u00A0' : (charlist + '').replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\\$1');
		var re = new RegExp('[' + charlist + ']+$', 'g');
		return (str + '').replace(re, '');
	}

	// Event handlers
	function treeButtonClick(event) {
		setSpecialization(event.data.treeNo);
		unlock();
		updateAllTrees();
		exportData();
	}

	function overviewSpellMouseOver() {

		var $this = $(this);
		var spellId = $this.attr('data-id');
		var spell = allSpells[spellId];
		
		var $tooltip = $('<ul/>');

		// Name
		$('<li/>').append($('<h3/>', { text: spell.name })).appendTo($tooltip);

		// Description		
		appendSpellDescription($tooltip, spell);
		
		Tooltip.show(this, $tooltip);
	}

	function iconMouseOver() {

		var talent = getTalentFromCell(this);
		showTalentTooltip(talent);
	}
	
	function iconMouseOut() {
		Tooltip.hide();
	}

	function iconMouseDown(event) {
		
		if(locked) {
			return false;
		}

		var talent = getTalentFromCell(this);
		var added, removed;

		if(event.which == 3) { // Right click
			removed = removePointFromTalent(talent);
		} else { // Left click
			added = addPointsToTalent(talent, 1);
		}

		if(!added && !removed) { // Not changed
			return false;
		}
	
		var updateAll = false;

		if(specializationPoints && specialization != null) {

			var pointsSpentInMainTree = data[specialization].points;

			if(added) {			
				if(pointsSpentInMainTree == specializationPoints) { // Fully specialized
					updateAll = true;
				}
			}
			
			if(removed) {
				if(pointsSpentInMainTree == (specializationPoints - 1)) { // No longer fully specialized
					updateAll = true;
				}
			}
		}

		if(added && pointsSpent == totalPoints) // All points have been spent
			updateAll = true;
		if(removed && pointsSpent == totalPoints - 1) // No longer have all points spent
			updateAll = true;

		if(updateAll) {
			updateAllTrees();
		} else {
			updateTree(talent.tree);
			updateInfo();
		}

		showTalentTooltip(talent);
		exportData();

		return false; // Disable text selection and dragging
	}
	
	function iconContextMenu() {	
		return false;	
	}

	function calcModeMouseOver() {

		var $tooltip = $('<ul/>');

		// Title
		$('<li/>').append($('<h3/>', { text: MsgTalentCalculator.info.calcMode.tooltip.title })).appendTo($tooltip);

		// Description
		$('<li/>').addClass('color-tooltip-yellow').text(MsgTalentCalculator.info.calcMode.tooltip.description).appendTo($tooltip);

		Tooltip.show(this, $tooltip);
	}

	function beastMasteryMouseOver() {

		var $tooltip = $('<ul/>');

		// Title
		$('<li/>').append($('<h3/>', { text: MsgTalentCalculator.info.beastMastery.tooltip.title })).appendTo($tooltip);

		// Description
		$('<li/>').addClass('color-tooltip-yellow').text(MsgTalentCalculator.info.beastMastery.tooltip.description).appendTo($tooltip);

		Tooltip.show(this, $tooltip);
	}

	// Utilities
	function setPoints(base, extra) {
		
		if(base != null)
			basePoints = base;
			
		if(extra != null)
			extraPoints = extra;
		
		totalPoints = basePoints + extraPoints;
	}

	function setSpecialization(spec) {
		if(specializationPoints == 0) {
			return;	
		}

		if(spec >= 0 && spec < NUM_TREES) {
			specialization = spec;
		} else {
			specialization = null;
		}

		if (specialization === null)
			return;

		if (glyphMode && specialization >= 0)
			$glyphs.removeClass('locked');
	}

	function getTalentFromCell(cell) {
	
		var $cell = $(cell);
		if($cell.hasClass('interact')) {
			$cell = $cell.parent();
		}

		var id = $cell.attr('data-id');

		return allTalents[id];
	}
	
	function getReqPointsInTree(talent) {
		return talent.y * pointsPerTier; // Number of points required in the tree to have this talent
	}
		
	/**
	 * Glyph Calculator
	 */

	function openGlyphSelector(e) {
		e.stopPropagation();

		if (specialization < 0 || specialization === null || typeof specialization == 'undefined' || overviewPaneVisible)
			return;

		var self = this,
			node = $(self),
			index = node.data('index'),
			type = node.data('glyph'),
			glyphs = allGlyphs[type],
			li,
			arrow = (node.offset().top - node.parentsUntil('.talentcalc-glyphs').parent().offset().top) - 15;

		$glyphSelector.find('.arrow-right').css('top', arrow);

		// Build list
		var wrapper = $glyphSelector.find('ul');
		wrapper.empty();

		for (var i = 0, glyph; glyph = glyphs[i]; i++) {
			if (chosenGlyphs[glyph.id])
				continue;

			li = $('<li/>');
			li.append( createGlyphNode(glyph) );

			wrapper.append(li);
}

		// Bind list click events
		wrapper.find('a').click(function(e) {
			e.stopPropagation();

			var id = $(this).data('id');

			chooseGlyph(id, type, index);
			replaceGlyph(self, this);
			updateInfo();
			exportData();
			
			$glyphSelector.hide();

			return false;
		});

		moveGlyphSelector(type);

		$(document).bind('click.tc', function(e) {
			if(e.which != 1) { // Left mouse button only
				return;
			}
			closeGlyphSelector();
			$(document).unbind('click.tc');
		});

		return false;
	}

	function closeGlyphSelector() {
		$glyphSelector.hide();
	}

	function moveGlyphSelector(column) {
		$glyphSelector
			.removeClass('column0 column1 column2')
			.addClass('column'+ column)
			.show();
	}

	function removeGlyph(id, type, index) {
		if (chosenGlyphs[id]) {
			if (glyphCounts[type])
				glyphCounts[type]--;

			delete chosenGlyphs[id];
			delete glyphMap[type +'-'+ index];
		}
	}

	function chooseGlyph(id, type, index) {
		var key = type +'-'+ index;

		if (glyphMap[key])
			removeGlyph(glyphMap[key], type, index);

		if (!glyphCounts[type])
			glyphCounts[type] = 0;

		chosenGlyphs[id] = id;
		glyphMap[key] = id;
		glyphCounts[type]++;
	}

	function replaceGlyph(target, chosen) {
		chosen = $(chosen);

		$(target)
			.html( chosen.html() )
			.attr('href', chosen.attr('href') )
			.removeClass('color-q0')
			.addClass('color-q1')
			.find('.description').remove().end()
			.parent().addClass('glyph-chosen');
	}

	function createGlyphNode(glyph) {
		var desc = glyph.description,
			length = (Core.locale == 'ko-kr') ? 50 : 90;

		if (desc.length > length)
			desc = glyph.description.substring(0, length) +'...';

		return $('<a/>', {
			href: Core.baseUrl +'/item/'+ glyph.itemId,
			html: Wow.Icon.framedIcon(glyph.icon, 18),
			'data-id': glyph.id
		})
		.append('<span class="name">'+ glyph.prettyName +'</span>')
		.append('<span class="description">'+ desc +'</span>');
	}

	function resetGlyphs() {
		var empty = $glyphs.find('.empty-glyph').html();

		$glyphs
			.addClass('locked')
			.find('a.glyph').each(function() {
				$(this)
				.html(empty)
				.removeClass('color-q1')
				.addClass('color-q0')
				.attr('href', 'javascript:;')
				.parent().removeClass('glyph-chosen');
		});

		chosenGlyphs = {};
		glyphMap = {};
		glyphCounts = {};
	}

	function emptyGlyph(e) {
		var node = $(this).siblings('a.glyph:first'),
			type = node.data('glyph'),
			index = node.data('index'),
			key = type +'-'+ index;

		node
			.html( $glyphs.find('.empty-glyph').html() )
			.removeClass('color-q1')
			.addClass('color-q0')
			.attr('href', 'javascript:;')
			.parent().removeClass('glyph-chosen');

		if (glyphMap[key])
			removeGlyph(glyphMap[key], type, index);

		updateInfo();
		exportData();
		
		$glyphSelector.hide();
	}

	function glyphRequiredLevel() {
		var count = 0;

		for (var i = 0; i < 3; i++) {
			if (glyphCounts[i] && glyphCounts[i] > count)
				count = glyphCounts[i];
		}

		return (count * 25);
	}
		
}

TalentCalculator.instances = {};        