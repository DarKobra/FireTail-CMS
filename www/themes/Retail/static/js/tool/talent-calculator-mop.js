var TalentCalculator = Class.extend({

	container: null,
	requiredLevel: null,
	resetButton: null,
	linkBuild: null,

	specsContainer: null,
	specsButtons: null,
	specs: null,

	spellsContainer: null,
	spellRows: null,

	talentsContainer: null,
	talentsTiers: null,
	talents: null,

	currentSpec: -1,
	currentTier: -1,
	currentLevel: 1,
	currentTalents: [],
	currentFilter: 'all',

	classId: 0,
	data: {},
	exportHash: '',

	MAX_TIERS: 6,
	MAX_LEVEL: 90,

	init: function(classId, data) {
		this.classId = classId;
		this.data = data;

		// DOM nodes
		this.container = $('#talent-calculator-' + classId);
		this.requiredLevel = this.container.find('.required-level span');
		this.linkBuild = this.container.find('.link-build');

		this.resetButton = this.container.find('.reset-button');
		this.resetButton.click( $.proxy(this.reset, this) );

		this.specsContainer = this.container.find('.specs');
		this.specs = this.specsContainer.find('.spec');
		this.specsButtons = this.specsContainer.find('.cell');
		this.specsButtons.click( $.proxy(this.specHandler, this) );

		this.spellsContainer = this.container.find('.spells');
		this.spellsContainer.find('.filters a').click( $.proxy(this.filterHandler, this) );
		this.spellRows = this.spellsContainer.find('tr');

		this.talentsContainer = this.container.find('.talents');
		this.talentsTiers = this.talentsContainer.find('.tier');
		this.talents = this.talentsContainer.find('.cell');
		this.talents.bind('click contextmenu', $.proxy(this.talentHandler, this) );

		this.container.find('.sharing a').click( $.proxy(this.shareHandler, this) );

		// Data
		for (var i = 0, l = this.MAX_TIERS, arr = []; i < l; i++) {
			arr[i] = null;
		}

		this.currentTalents = arr;
		this.importBuild();
	},

	/**
	 * Choose a specification and swap to the spells view.
	 *
	 * @param e
	 */
	specHandler: function(e) {
		e.preventDefault();
		e.stopPropagation();

		this.chooseSpec( $(e.currentTarget).data('index') );
		this.update();

		return false;
	},

	/**
	 * Click handler for talents. If left click, confirm and go to the next.
	 * If right click, remove and go to the previous.
	 *
	 * @param e
	 */
	talentHandler: function(e) {
		e.preventDefault();
		e.stopPropagation();

		var node = $(e.currentTarget),
			index = node.data('index'),
			tier = node.data('tier');

		// If right click, remove
		if (e.which == 3) {
			this.removeTalent(tier, true);
		} else {
			this.chooseTalent(tier, index);
		}

		this.update();

		return false;
	},

	/**
	 * Handler to do with filter clicks.
	 *
	 * @param e
	 */
	filterHandler: function(e) {
		e.preventDefault();
		e.stopPropagation();

		var node = $(e.currentTarget),
			type = node.data('type');

		this.currentFilter = type;

		node.siblings().removeClass('filter-active');
		node.addClass('filter-active');

		this.filterSpells(type);
	},

	/**
	 * Handles the logic for sharing of builds.
	 *
	 * @param e
	 */
	shareHandler: function(e) {
		e.preventDefault();
		e.stopPropagation();

		var node = $(e.currentTarget),
			rel = node.attr('rel'),
			href = node.data('url'),
			label = '';

		if (rel === 'facebook') {
			label = 'Facebook';
			window.open(href + '&u=' + encodeURIComponent(location.href), 'facebook', 'toolbar=0,status=0,width=630,height=440');

		} else if (rel === 'twitter') {
			label = 'Twitter';
			window.open(href + '&url=' + encodeURIComponent(location.href), 'twitter', 'toolbar=0,status=0,width=700,height=300');

		} else if (rel === 'me2day') {
			label = 'Me2Day (KR)';
			window.open(href + ' ' + encodeURIComponent(location.href), 'me2day');

		} else if (rel === 'weibo') {
			label = 'WeiBo';
			window.open(href + '&url=' + encodeURIComponent(location.href), 'weibo');

		} else if (rel == 'link') {
			label = '(Manual)';
			window.open(location.href);
		}

		try {
			_gaq.push(['_trackEvent', 'WoW:MoP Talent Calculator', 'Share', label + ' ' + this.exportHash]);
		} catch(e) { }

		return false;
	},

	/**
	 * Remove the talent from the selected tier.
	 *
	 * @param tier
	 */
	removeTalent: function(tier) {
		this.unlockTier(tier);

		this.currentTier = tier;
		this.currentTalents[tier] = null;
	},

	/**
	 * Choose a talent and disable the tier and activate the next tier.
	 *
	 * @param tier
	 * @param index
	 */
	chooseTalent: function(tier, index) {
		this.lockTier(tier);

		this.currentTier = tier;
		this.currentTalents[tier] = index;

		this.talentsTiers.eq(tier).find('.cell:eq(' + index + ')')
			.removeClass('cell-disabled')
			.addClass('cell-selected');
	},

	/**
	 * Choose a specification and swap to the spells view.
	 *
	 * @param index
	 */
	chooseSpec: function(index) {
		var node = this.specsButtons.eq(index);

		this.currentSpec = index;

		this.specsContainer.addClass('compact');

		this.specsButtons.removeClass('cell-selected').attr('rel', '');
		node.addClass('cell-selected');

		this.specs.removeClass('spec-selected');
		node.parent().addClass('spec-selected');

		this.spellsContainer.detach().appendTo(node.parent());
		this.spellsContainer.find('.filters a[data-type="' + this.currentFilter + '"]').click();
	},

	/**
	 * Filter down the spells table.
	 *
	 * @param type
	 */
	filterSpells: function(type) {
		var filter = '';

		if (type == 'all') {
			filter = '.type--1, .type-' + this.currentSpec;
		} else if (type == 'class') {
			filter = '.type--1';
		} else if (type == 'spec') {
			filter = '.type-' + this.currentSpec;
		}

		this.spellRows.hide().removeClass('row1').filter(function() {
			return $(this).is(filter);
		}).show().filter(':even').addClass('row1');
	},

	/**
	 * Update everything.
	 */
	update: function() {
		var tier = -1,
			level = 1;

		for (var i = 0, l = this.currentTalents.length; i < l; i++) {
			if (this.currentTalents[i] !== null && this.currentTalents[i] >= 0) {
				tier = i;
			}
		}

		if (tier == -1) {
			if (this.currentSpec >= 0) {
				level = 10;
			}
		} else {
			level = (tier + 1) * 15;
		}

		if (level > this.MAX_LEVEL)
			level = this.MAX_LEVEL;
		else if (level <= 0)
			level = 1;

		this.currentLevel = level;
		this.requiredLevel.text(level);

		if (this.currentSpec >= 0 || this.currentTier >= 0) {
			this.resetButton
				.removeAttr('disabled')
				.removeClass('disabled');
		}

		this.exportBuild();
	},

	/**
	 * Lock the tier by applying disabled classes.
	 *
	 * @param tier
	 */
	lockTier: function(tier) {
		this.talentsTiers.eq(tier).find('.cell')
			.addClass('cell-disabled')
			.removeClass('cell-selected');
	},

	/**
	 * Remove the disabled classes.
	 *
	 * @param tier
	 */
	unlockTier: function(tier) {
		this.talentsTiers.eq(tier).find('.cell')
			.removeClass('cell-disabled')
			.removeClass('cell-selected');
	},

	/**
	 * Export the build to a hash.
	 */
	exportBuild: function() {
		var meta = Hash.encode([ this.classId, this.currentSpec ]),
			talents = '';

		for (var i = 0, l = this.MAX_TIERS; i < l; i++) {
			if (this.currentTalents[i] != null) {
				talents += this.currentTalents[i];
			} else {
				talents += Hash.empty;
			}
		}

		if (talents == '......') {
			talents = '';
		}

		this.exportHash = meta + Hash.delimiter + talents;

		location.replace('#' + this.exportHash);

		this.linkBuild.attr('href', location.href);
	},

	/**
	 * Import the current build if the hash exists.
	 */
	importBuild: function(hash) {
		var build = hash || Core.getHash();

		if (!build || build == '.')
			return;

		var parts = build.split(Hash.delimiter),
			meta = Hash.decode(parts[0]),
			points = parts[1].split('');

		if (meta[1] >= 0) {
			this.chooseSpec(meta[1]);
		}

		for (var i = 0, l = points.length; i < l; i++) {
			if (points[i] !== Hash.empty)
				this.chooseTalent(i, parseInt(points[i]));
		}

		this.update();
	},

	/**
	 * Reset everything.
	 */
	reset: function() {
		this.currentSpec = -1;
		this.currentTier = -1;
		this.currentLevel = 1;

		for (var i = 0, l = this.MAX_TIERS; i < l; i++) {
			this.currentTalents[i] = null;
			this.unlockTier(i);
		}

		this.requiredLevel.text(1);

		this.resetButton
			.attr('disabled', 'disabled')
			.addClass('disabled');

		this.specsContainer.removeClass('compact');
		this.specsButtons.removeClass('cell-selected').attr('rel', 'np');
		this.specs.removeClass('spec-selected');

		this.update();
	}

});        