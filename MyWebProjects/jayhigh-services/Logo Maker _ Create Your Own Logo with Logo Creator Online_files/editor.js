function getUrlParameter(name) {
	name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
	var results = regex.exec(location.search);
	return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};
//----------------------------------------------------
// Theses cases to used in handle to undo-redo
const LOGO_TEXT_CHANGE = "logo_text_change";
const LOGO_TEXT_TRANSFORM = "logo_text_transform";

const LOGO_TEXT1_CHANGE = "logo_text1_change";
const LOGO_TEXT2_CHANGE = "logo_text2_change";

const LOGO_TEXT1_TRANSFORM = "logo_text1_transform";
const LOGO_TEXT2_TRANSFORM = "logo_text2_transform";

const LOGO_TEXT_FS = "logo_text_fs";
const LOGO_TEXT_LS = "logo_text_ls";

const LOGO_TEXT1_FS = "logo_text1_fs";
const LOGO_TEXT2_FS = "logo_text2_fs";

const LOGO_TEXT1_LS = "logo_text1_ls";
const LOGO_TEXT2_LS = "logo_text2_ls";

const LOGO_FONT_CHANGE = "logo_font_change";

const LOGO_FONT1_CHANGE = "logo_font1_change";
const LOGO_FONT2_CHANGE = "logo_font2_change";

const SLOGAN_TEXT_CHANGE = "slogan_text_change";
const SLOGAN_REMOVE = "slogan_remove";
const SLOGAN_TEXT_TRANSFORM = "slogan_text_transform";
const SLOGAN_TEXT_FS = "slogan_text_fs";
const SLOGAN_TEXT_LS = "slogan_text_ls";

const TEXT_SLOGAN_DS = "text_slogan_distance";
const SLOGAN_FONT_CHANGE = "slogan_font_change";

const SYMBOL_ADD = "symbol_add";
const SYMBOL_REMOVE = "symbol_remove"; //3
const SYMBOL_POSITION = "symbol_position"; //0/1,2/4
const SYMBOL_SIZE = "symbol_size";
const SYMBOL_DS = "symbo_distance";
const SYMBOL_CHANGE = "symbol_change";

const MONOGRAM_ADD = "monogram_add";
const MONOGRAM_REMOVE = "monogram_remove"; //3
const MONOGRAM_POSITION = "monogram_position"; //0/1,2/4
const MONOGRAM_SIZE = "monogram_size";
const MONOGRAM_DS = "monogram_distance";
const MONOGRAM_CHANGE = "monogram_change";

const OUTER_CONTAINER_ADD = "outer_container_add";
const OUTER_CONTAINER_REMOVE = "outer_container_remove";
const OUTER_CONTAINER_CHANGE = "outer_container_change";
const OUTER_CONTAINER_SIZE = "outer_container_size";

const INNER_CONTAINER_ADD = "inner_container_add";
const INNER_CONTAINER_REMOVE = "inner_container_remove";
const INNER_CONTAINER_CHANGE = "inner_container_change";

const LAYOUT_VARIATIONS = "layout_variations";
const GENERATE_MORE_LOGOS = "generate_more_logs";

const EDIT_COLORS_BG = "edit_colors_background";

const EDIT_COLORS_LOGO_TEXT = "edit_colors_logo_text";
const EDIT_GRADIENT_COLORS_LOGO_TEXT = "edit_gradient_colors_logo_text";

const EDIT_COLORS_LOGO_TEXT1 = "edit_colors_logo_text1";
const EDIT_COLORS_LOGO_TEXT2 = "edit_colors_logo_text2";

const EDIT_GRADIENT_COLORS_LOGO_TEXT1 = "edit_gradient_colors_logo_text1";
const EDIT_GRADIENT_COLORS_LOGO_TEXT2 = "edit_gradient_colors_logo_text2";

const EDIT_COLORS_SLOGAN_TEXT = "edit_colors_slogan_text";
const EDIT_GRADIENT_COLORS_SLOGAN_TEXT = "edit_gradient_colors_slogan_text";

const EDIT_COLORS_SYMBOL = "edit_colors_symbol";
const EDIT_GRADIENT_COLORS_SYMBOL = "edit_gradient_colors_symbol";

const EDIT_COLORS_MONOGRAM = "edit_colors_monogram";
const EDIT_GRADIENT_COLORS_MONOGRAM = "edit_gradient_colors_monogram";

const EDIT_COLORS_INNER_CONTAINER = "edit_colors_inner_container";
const EDIT_GRADIENT_COLORS_INNER_CONTAINER = "edit_gradient_colors_inner_container";

const EDIT_COLORS_OUTER_CONTAINER = "edit_colors_outer_container";
const EDIT_GRADIENT_COLORS_OUTER_CONTAINER = "edit_gradient_colors_outer_container";

const EDIT_COLORS_VARIATIONS = "edit_colors_variations";
//----------------------------------------------------
var cbn = "DW-1614_icon_issue_rv";
var version = getUrlParameter('version');
var prevPage = sessionStorage.getItem("prevPage");
var editor_exceptions = new Array();
var currentPopoverObj = null;
var currentPopoverBtn = null;
var inputTextTimer = null;
var inputTextTime = 700;
$(function () {
	/**
	 * code for checking session storage working or not
	 */
	try {
		sessionStorage.setItem('sessionStorage', 1);
		sessionStorage.removeItem('sessionStorage');
	} catch (e) {
		alert('Your web browser does not support storing settings locally. The most common cause of this is using "Private Browsing Mode". Some settings may not save or some features may not work properly for you.');
		window.location.href = DH.baseURL + '/tools/logo-maker';
		return;
	}
    /**
	 * add utm url with editor 
	 */
	var qrStr = "&";
	var url = window.location.href;
	url = url.split("?")[1];
	var params = url.split('&');
	var editorTimer;
	var loginPopupTimer;
    /**
	 * Array for defining gradient colors and stops
	 */
	var gradientsArray = {
		gold: { name: 'Gold', stops: [{ offset: 0.05, color: '#B68648' }, { offset: 0.95, color: '#FBF3A3' }] },
		silver: { name: 'Silver', stops: [{ offset: 0.05, color: '#6E6F71' }, { offset: 0.95, color: '#ECECEC' }] },
		bronze: { name: 'Bronze', stops: [{ offset: 0.05, color: '#d64000' }, { offset: 0.95, color: '#edc5be' }] },
		blue: { name: 'Blue', stops: [{ offset: 0.05, color: '#2d388a' }, { offset: 0.95, color: '#00aeef' }] },
		bubblegum: { name: 'Bubblegum', stops: [{ offset: 0.05, color: '#fe8dc6' }, { offset: 0.95, color: '#fed1c7' }] },
		graphite: { name: 'Graphite', stops: [{ offset: 0, color: '#51504f' }, { offset: 0.1, color: '#939598' }, { offset: 0.3, color: '#414042' }, { offset: 0.5, color: '#939598' }, { offset: 0.7, color: '#494c50' }, { offset: 0.9, color: '#6d6e71' }, { offset: 1, color: '#414042' }] },
		green: { name: 'Green', stops: [{ offset: 0, color: '#006838' }, { offset: 1, color: '#96cf24' }] },
		platinum: { name: 'Platinum', stops: [{ offset: 0, color: '#786756' }, { offset: 0.33, color: '#847361' }, { offset: 0.67, color: '#a8a49b' }, { offset: 1, color: '#d6d6d6' }] },
		purple: { name: 'Purple', stops: [{ offset: 0, color: '#25235e' }, { offset: 1, color: '#ae4792' }] },
		purpleblue: { name: 'Purple Blue', stops: [{ offset: 0, color: '#6d7cff' }, { offset: 1, color: '#ff51ff' }] },
		rose: { name: 'Rose', stops: [{ offset: 0, color: '#914d3c' }, { offset: 0.1, color: '#b37362' }, { offset: 0.3, color: '#fcc5b3' }, { offset: 0.5, color: '#f7b7a6' }, { offset: 1, color: '#945f50' }] },
		sand: { name: 'Sand', stops: [{ offset: 0, color: '#ffb295' }, { offset: 1, color: '#fedac6' }] },
		yellow: { name: 'Yellow', stops: [{ offset: 0, color: '#e93e3a' }, { offset: 0.1, color: '#ed683c' }, { offset: 0.3, color: '#f3903f' }, { offset: 0.7, color: '#fdc70c' }, { offset: 1, color: '#fff33b' }] },
	}
	var recentColors = [];
	$.each(params, function (index, value) {
		var v = value.split('=');
		if (v[0] != 'logoid' && v[0] != 'editor') qrStr += value + '&';
	});
	qrStr = qrStr.replace(/&$/, '');
	qrStr = qrStr.replace(/\?$/, '');
	if (qrStr == "&") {
		qrStr = "";
	}
    /**
	 * some defaults variable used in whole JS 
	 */
	var svgTagNameSpace = "";
	var showWarning = true;
	var showStep6Anm = (DH.DH_APP_MODE == 'DEVELOPMENT') ? false : true;
	var currCompFontObject;      // current font object
	var currCompFont2Object;      // current font2 object
	var currSloganFontObject     // current slogan object
	var currMonogramFontObject     // current monogram object
	var loadMoreStart = 0;
	var dynamicLogoCounter = 0;
	var jqXHR, jqXHR1;
	var randomPagination = 0;
	var savedPagination = 0;
	var favoritePagination = 0;
	var rangeSliderFlag = false;
	var editorParameters = {};
	var svgWidth = 640;
	var svgHeight = 480;
	var templatesData = [];
	var step6templatesData = [];
	var templatesDataJson;
	var dooubleLineTemplatesDataJson = [];
	var favoriteJSON = { companyFont: [], sloganFont: [], colorPallete: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [] }, colorVariation: [], symbolVariation: [], containerVariation: [], layoutVariation: [], logoVariation: [] };
	var forSearchSymbol = "Type something above or pick a related term to see symbols";
	var whileSearchingSymbol = "Please wait while we are generating Logos";
	var atLeastOneIsShowTemplateDoubleLineIsOn = false;
	/**
	 * fetch all templates initally 
	 */
	$.ajax({
		url: DH.baseURL + '/logoMakerAjax.php',
		type: 'POST',
		data: { action: 'templates', type_id: 0 },
		async: false,
		success: function (json) {
			var json = getValidJsonParseObj(json);
			var i = 0;
			var j = 0;
			templatesDataJson = json.data.templates;
			$.each(json.data.templates, function (k, v) {
				v.template_code.template_id = v.template_id;
				v.template_code.template_db_id = v.template_id;
				v.template_code.template_direction = v.template_direction;
				// if (v.is_show == 1 && (v.template_id == 6)) {
				var withDoubleTextTemplate = JSON.parse(JSON.stringify(templatesDataJson[k]));
				var withDoubleTextTemplateCode = JSON.parse(JSON.stringify(withDoubleTextTemplate.template_code));
				withDoubleTextTemplateCode.text1 = Object.assign({}, withDoubleTextTemplateCode.text);
				withDoubleTextTemplateCode.text2 = Object.assign({}, withDoubleTextTemplateCode.text);
				withDoubleTextTemplateCode.updates.text1 = {};
				withDoubleTextTemplateCode.updates.text2 = {};
				if (withDoubleTextTemplateCode.hasOwnProperty("text")) {
					delete withDoubleTextTemplateCode["text"];
				}
				if (withDoubleTextTemplateCode.updates.hasOwnProperty("text")) {
					delete withDoubleTextTemplateCode.updates["text"];
				}
				withDoubleTextTemplateCode.text1.field = "text1"
				withDoubleTextTemplateCode.text2.field = "text2";
				withDoubleTextTemplateCode.template_db_id = v.template_code.template_id + ".1";
				withDoubleTextTemplate.template_code = withDoubleTextTemplateCode;
				dooubleLineTemplatesDataJson.push(withDoubleTextTemplate);
				if (v.is_show == 1) {
					templatesData[i++] = v.template_code; //withoutDoubleTextTemplateCode
					step6templatesData[j++] = v.template_code;//withoutDoubleTextTemplateCode
					if (v.is_double_line_company_text == 1) {
						step6templatesData[j++] = withDoubleTextTemplateCode;
						atLeastOneIsShowTemplateDoubleLineIsOn = true;
					}
					if (atLeastOneIsShowTemplateDoubleLineIsOn) {
						templatesData[i++] = withDoubleTextTemplateCode;
					}
				}
			});
		}
	});
    /**
	 * constants for the defualt templates
	 */
	var constantVars = {
		targets: { 2: 'logo', 7: 'logo', 8: 'logo', 9: 'slogan', 10: 'slogan', 3: 'background', 12: 'background', 13: 'logoColor', 14: 'sloganColor', 15: 'symbolColor', 16: 'containerColor' },
		colors: { 'bgColor': '#000000', 'bgColorFamily': '', 'mainTextColor': '#ffffff', 'mainTextFamily': '', 'sloganTextColor': '#ffffff', 'sloganTextFamily': '', 'iconColor': '#ffffff', 'iconFamily': '', 'frameColor': '#ffffff', 'frameFamily': '', 'iconFrameColor': '#ffffff', 'iconFrameFamily': '' },
		SVGWIDTH: svgWidth,
		SVGHEIGHT: svgHeight,
		VIEWBOXWIDTH: 640,
		VIEWBOXHEIGHT: 480,
		CONTAINERWIDTH: parseInt(this.SVGWIDTH / 0.7),
		CONTAINERHEIGHT: parseInt(this.SVGHEIGHT / 0.7),
		MINX: (this.SVGWIDTH - this.CONTAINERWIDTH) / 2,
		MINY: (this.SVGHEIGHT - this.CONTAINERHEIGHT) / 2,
		MAXX: ((this.SVGWIDTH - this.CONTAINERWIDTH) / 2) + this.CONTAINERWIDTH,
		MAXY: ((this.SVGHEIGHT - this.CONTAINERHEIGHT) / 2) + this.CONTAINERHEIGHT,
		FRAMERATIO: 210,
		SPACING: {
			'logoTextSlider': 82,
			'logoLetterSpacing': 1,
			'sloganTextSize': 52,
			'sloganLetterSpacing': 0,
			'textSloganDistSlider': 10,
			'logoSizeSlider': 150,
			'iconDistanceSlider': 10,
			'monogramTextSize': 150,
			'frameSizeSlider': 50
		},
		ORIGINAL_SPACING: {
			'logoTextSlider': 82,
			'logoLetterSpacing': 1,
			'sloganTextSize': 52,
			'sloganLetterSpacing': 0,//28,//9,//25,//6,
			'textSloganDistSlider': 10,
			'logoSizeSlider': 150,
			'iconDistanceSlider': 10,
			'frameSizeSlider': 50,
			'monogramTextSize': 150,
			'isJustChangeSloganLetterSpacing': false
		}
	}
	/**
	 *  start common logo make function 
	 */
	var logoMakerFunction = {
		objSet: [],
		/* Favorite listing record */
		// code by Tushar	
		resetFavoriteJson: function () {
			debugConsole("resetFavoriteJson");
			favoriteJSON.companyFont = [];
			favoriteJSON.sloganFont = [];
			favoriteJSON.colorPallete = [];
			favoriteJSON.colorVariation = [];
			favoriteJSON.symbolVariation = [];
			favoriteJSON.containerVariation = [];
			favoriteJSON.layoutVariation = [];
			favoriteJSON.logoVariation = [];
			lEditor.setSession('favoriteJSON', getValidJsonStringifyObj(favoriteJSON));
		},

		addToFavoriteJson: function (type, subtype, val, lid) {
			debugConsole("addToFavoriteJson " + type + ",,," + subtype + ",,," + val + ",,," + lid);
			var isExist = 0;
			if (typeof favoriteJSON[type][subtype] !== 'undefined') {
				for (var i = 0; i < favoriteJSON[type][subtype].length; i++) {
					if (favoriteJSON[type][subtype][i].val == val) {
						isExist = 1;
					}
				}
			}
			if (isExist == 0) {
				favoriteJSON[type][subtype].push({ lid: lid, val: val });
			}
			debugConsole("favoriteJSON:=" + typeof (favoriteJSON) + ",,," + favoriteJSON);
			lEditor.setSession('favoriteJSON', getValidJsonStringifyObj(favoriteJSON));
		},

		removeToFavoriteJson: function (type, subtype, val) {
			for (var i = 0; i < favoriteJSON[type][subtype].length; i++) {
				if (favoriteJSON[type][subtype][i].val === val) {
					favoriteJSON[type][subtype].splice(i, 1);
				}
			}
			lEditor.setSession('favoriteJSON', getValidJsonStringifyObj(favoriteJSON));
		},

		isExistInFavoriteJson: function (type, subtype, val) {
			if (typeof favoriteJSON[type][subtype] !== 'undefined') {
				for (var i = 0; i < favoriteJSON[type][subtype].length; i++) {
					if (favoriteJSON[type][subtype][i].val === val) {
						return favoriteJSON[type][subtype][i].lid;
					}
				}
			}
			return false;
		},

		updateLogoIdJson: function (type, subtype, val, logoId) {
			debugConsole("updateLogoIdJson");
			if (logoId > 0) {
				for (var i = 0; i < favoriteJSON[type][subtype].length; i++) {
					if (favoriteJSON[type][subtype][i].val === val) {
						favoriteJSON[type][subtype][i].lid = logoId;
						lEditor.setSession('favoriteJSON', getValidJsonStringifyObj(favoriteJSON));
					}
				}
			}
		},

		removeLogoIdJson: function (logoId) {
			debugConsole("removeLogoIdJson");
			var type = '';
			var subtype = '';
			for (var i = 0; i < Object.keys(favoriteJSON).length; i++) {
				type = Object.keys(favoriteJSON)[i];
				for (var j = 0; j < Object.keys(favoriteJSON[Object.keys(favoriteJSON)[i]]).length; j++) {
					subtype = Object.keys(favoriteJSON[Object.keys(favoriteJSON)[i]])[j];
					for (var k = 0; k < favoriteJSON[type][subtype].length; k++) {
						if (favoriteJSON[type][subtype][k].lid == logoId) {
							favoriteJSON[type][subtype].splice(k, 1);
							lEditor.setSession('favoriteJSON', getValidJsonStringifyObj(favoriteJSON));
							$("[data-logo-id=" + logoId + "]").removeClass('active');
						}
					}
				}
			}
		},
		/* Favorite listing record End */

		/**
		 * for getting Ranodm number (any) 
		 */
		genRandomId: function getRandomNumbers() {
			var array = new Uint32Array(1);
			var cryptoObj = window.crypto || window.msCrypto;
			cryptoObj.getRandomValues(array);
			return array[0];
		},
        /**
		 * getting initial character of  logoname
		 * @param {*} logoName 
		 */
		genMonoGramText: function (logoName) {
			var monogram = "";
			var res = logoName.split(" ");
			var i = 0;
			$.each(res, function (k, v) {
				if (v != "") {
					if (i < 4) {
						monogram += v.charAt(0).toUpperCase();
					}
					i++;
				}
			});
			debugConsole("genMonoGramText:=" + monogram);
			return monogram;
		},
		/**
		 * 
		 * @param {*} p_nValue 
		 */
		setSliderForSloganLetterSpacing: function (p_nValue) {
			debugConsole("setSliderForSloganLetterSpacing:=" + p_nValue)
			// constantVars.SPACING.sloganLetterSpacing = p_nValue;
			lEditor.setSession('sloganLetterSpacing', p_nValue);
			$(".sloganLetterSpacing").slider("option", "value", p_nValue);
			$(".sloganLetterSpacing").parents('.rangeSlider').find('.rangeSliderValue').val(p_nValue);
		},
		/**
		 * 
		 * @param {*} p_nValue 
		 */
		resetLogoTextSlider: function (p_nValue) {
			debugConsole("resetLogoTextSlider p_nValue:=" + p_nValue);
			if ($(".logoTextSlider").length) {
				$(".logoTextSlider").slider("option", "value", p_nValue);
				$(".logoTextSlider").parents('.rangeSlider').find('.rangeSliderValue').val(p_nValue);
			}
		},
		/**
		 * 
		 * @param {*} p_nValue 
		 */
		resetLogoTextLetterSpacingSlider: function (p_nValue) {
			debugConsole("resetLogoTextLetterSpacingSlider p_nValue:=" + p_nValue);
			if ($(".logoLetterSpacing").length) {
				$(".logoLetterSpacing").slider("option", "value", p_nValue);
				$(".logoLetterSpacing").parents('.rangeSlider').find('.rangeSliderValue').val(p_nValue);
			}
		},
        /**
        /**
		 * 
		 * @param {*} type 
		 */
		resetSlider: function (type, p_bIsChangeJSONValue = false) {
			debugConsole("resetSlider:=" + type);
			switch (type) {
				case "logoTextSlider":
					constantVars.SPACING.logoTextSlider = constantVars.ORIGINAL_SPACING.logoTextSlider;
					lEditor.setSession('logoTextSlider', constantVars.SPACING.logoTextSlider);
					logoMakerFunction.resetLogoTextSlider(constantVars.SPACING.logoTextSlider);

					break;
				case "logoLetterSpacing":
					constantVars.SPACING.logoLetterSpacing = constantVars.ORIGINAL_SPACING.logoLetterSpacing;
					lEditor.setSession('logoLetterSpacing', constantVars.SPACING.logoLetterSpacing);
					logoMakerFunction.resetLogoTextLetterSpacingSlider(constantVars.SPACING.logoLetterSpacing);
					break;

				case "sloganTextSize":
					constantVars.SPACING.sloganTextSize = constantVars.ORIGINAL_SPACING.sloganTextSize;
					lEditor.setSession('sloganTextSize', constantVars.SPACING.sloganTextSize);
					$(".sloganTextSize").slider("option", "value", constantVars.SPACING.sloganTextSize);
					$(".sloganTextSize").parents('.rangeSlider').find('.rangeSliderValue').val(constantVars.SPACING.sloganTextSize);
					if (p_bIsChangeJSONValue) {
						lEditor.currentLogo.generate.sloganTextSize = constantVars.SPACING.sloganTextSize;
					}
					break;
				case "sloganLetterSpacing":
					constantVars.SPACING.sloganLetterSpacing = constantVars.ORIGINAL_SPACING.sloganLetterSpacing;
					lEditor.setSession('sloganLetterSpacing', constantVars.SPACING.sloganLetterSpacing);
					$(".sloganLetterSpacing").slider("option", "value", constantVars.SPACING.sloganLetterSpacing);
					$(".sloganLetterSpacing").parents('.rangeSlider').find('.rangeSliderValue').val(constantVars.SPACING.sloganLetterSpacing);
					if (p_bIsChangeJSONValue) {
						lEditor.currentLogo.generate.sloganLetterSpacing = constantVars.SPACING.sloganLetterSpacing;
					}
					break;
				case "textSloganDistSlider":
					constantVars.SPACING.textSloganDistSlider = constantVars.ORIGINAL_SPACING.textSloganDistSlider;
					lEditor.setSession('textSloganDistSlider', constantVars.SPACING.textSloganDistSlider);
					$(".textSloganDistSlider").slider("option", "value", constantVars.SPACING.textSloganDistSlider);
					$(".textSloganDistSlider").parents('.rangeSlider').find('.rangeSliderValue').val(constantVars.SPACING.textSloganDistSlider);
					if (p_bIsChangeJSONValue) {
						lEditor.currentLogo.generate.textSloganDistSlider = constantVars.SPACING.textSloganDistSlider;
					}
					lEditor.currentLogo.generate.templatePath.lastTextDistance = 0;
					lEditor.currentLogo.generate.templatePath.iconShiftDueToSloganDistance = 0;
					break;

				case "logoSizeSlider":
					constantVars.SPACING.logoSizeSlider = constantVars.ORIGINAL_SPACING.logoSizeSlider;
					lEditor.setSession('logoSizeSlider', constantVars.SPACING.logoSizeSlider);
					$(".logoSizeSlider").slider("option", "value", constantVars.SPACING.logoSizeSlider);
					$(".logoSizeSlider").parents('.rangeSlider').find('.rangeSliderValue').val(constantVars.SPACING.logoSizeSlider);
					if (p_bIsChangeJSONValue) {
						lEditor.currentLogo.generate.logoSizeSlider = constantVars.SPACING.logoSizeSlider;
					}
					break;
				case "iconDistanceSlider":
					constantVars.SPACING.iconDistanceSlider = constantVars.ORIGINAL_SPACING.iconDistanceSlider;
					lEditor.setSession('iconDistanceSlider', constantVars.SPACING.iconDistanceSlider);
					$(".iconDistanceSlider").slider("option", "value", constantVars.SPACING.iconDistanceSlider);
					$(".iconDistanceSlider").parents('.rangeSlider').find('.rangeSliderValue').val(constantVars.SPACING.iconDistanceSlider);
					if (p_bIsChangeJSONValue) {
						lEditor.currentLogo.generate.iconDistanceSlider = constantVars.SPACING.iconDistanceSlider;
					}
					lEditor.currentLogo.generate.templatePath.lastSymbolXDistance = 0;
					lEditor.currentLogo.generate.templatePath.lastSymbolYDistance = 0;
					break;
				case "frameSizeSlider":
					constantVars.SPACING.frameSizeSlider = constantVars.ORIGINAL_SPACING.frameSizeSlider;
					lEditor.setSession('frameSizeSlider', constantVars.SPACING.frameSizeSlider);
					$(".frameSizeSlider").slider("option", "value", constantVars.SPACING.frameSizeSlider);
					$(".frameSizeSlider").parents('.rangeSlider').find('.rangeSliderValue').val(constantVars.SPACING.frameSizeSlider);
					break;
			}
		},
		/**
		 * check combination is avail or not in array  ( for step - 6 )
		 * @param {*} obj 
		 * @param {*} combination 
		 */
		isUniqueComination: function (obj, combination) {
			var isUnique = true;
			if (obj.length < 1) {
				return true;
			}
			$.each(obj, function (k, v) {
				if (logoMakerFunction.isEqualArray(v, combination)) {
					isUnique = false;
				}
			});
			return isUnique;
		},
        /**
		 * for getting random value  from intervals  
		 * @param {*} min 
		 * @param {*} max 
		 */
		randomIntFromInterval: function (min, max) {
			max = max - 1;
			return Math.floor(Math.random() * (max - min + 1) + min);
		},
        /**
		 * getting random array for step-6
		 * @param {*} arr 
		 */
		getRandomCombination: function (arr) {
			var random = [];
			$.each(arr, function (k, v) {
				random.push(logoMakerFunction.randomIntFromInterval(0, v));
			});
			return random;
		},
        /**
		 * used chroma js for getting shades of any color
		 * @param {*} colorCode 
		 */
		getShadesOfColor: function (colorCode) {
			var colorList = [];
			var steps = 10;
			var dimColor = [];
			var darkColor = [];
			var chromaColor = chroma(colorCode);
			var i = 0;
			var j = 0;
			dimColor[i++] = chromaColor.brighten(j);
			for (; i < steps;) {
				j = j + 0.5;
				dimColor[i++] = chromaColor.brighten(j);
				if (i == 10) continue;
				dimColor[i++] = chromaColor.darken(j);

			}
			colorList = darkColor.concat(dimColor);
			return colorList;
		},
		/**
		 * getting final logo Template which one save
		 * @param {\} logoObj 
		 */
		getFinalLogoTemplate: function (logoObj) {
			debugConsole("getFinalLogoTemplate");
			if (typeof logoObj.templatePath.iconFrameBox === 'undefined') {
				logoObj.templatePath.iconFrameBox = {};
				logoObj.templatePath.iconFrameBox.x = 0;
				logoObj.templatePath.iconFrameBox.y = 0;
				logoObj.templatePath.iconFrameBoxScale = 1;

				logoObj.templatePath.updates.iconFrameBox = {};
				logoObj.templatePath.updates.iconFrameBox.x = 0;
				logoObj.templatePath.updates.iconFrameBox.y = 0;
				logoObj.templatePath.updates.iconFrameBox.scale = 1;
			}
			var idKey = logoMakerFunction.genRandomId();
			var getSVGTag = logoMakerFunction.getDynamicSvgTag();
			// debugConsole("getSVGTag:="+getSVGTag);
			var template = null;
			if (getSVGTag != "") {
				template = getSVGTag;
			} else {
				template = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" height="100%" width="100%" x="0px" y="0px" viewBox="0 0 ' + constantVars.VIEWBOXWIDTH + ' ' + constantVars.VIEWBOXHEIGHT + '" xml:space="preserve" preserveAspectRatio="xMidYMid meet" class="">{{textGradient}}{{text2Gradient}}{{sloganGradient}}{{iconGradient}}{{frameGradient}}{{iconFrameGradient}}';
			}

			template += '<rect x="0px" y="0px" width="100%" height="100%" fill="{{svgColor}}"/>';
			template += '<g class="logo-container-box logoContainerBox" transform="scale({{logoContainerScale}}) translate({{logoContainerX}},{{logoContainerY}})">';

			if (logoObj.templatePath.isFrame == 1) {
				template += '<g class="container_1" transform="scale({{frameScale}}) translate({{frameX}},{{frameY}})"  fill="{{frameFill}}">{{frameHtml}}</g>';
			}
			template += '<g class="containerBody" transform="scale({{containerBodyScale}}) translate({{containerBodyX}},{{containerBodyY}})" >';
			if (logoObj.templatePath.isIcon == 1 || logoObj.templatePath.isMono == 1) {
				template += '<g class="sampleIconBox" transform="scale({{iconFrameBoxScale}}) translate({{iconFrameBoxX}},{{iconFrameBoxY}})">';
				if (logoObj.templatePath.isIconFrame == 1) {
					template += '<g class="iconFrame" transform="scale({{iconFrameScale}}) translate({{iconFrameX}},{{iconFrameY}})"  fill="{{iconFrameFill}}">{{iconFrameHtml}}</g>';
				}
				template += '<g class="sampleIcons_1" transform="scale({{iconScale}}) translate({{iconX}},{{iconY}})" fill="{{iconFill}}">{{iconHtml}}</g>';
				template += '</g>';
			}
			template += '<g class="sampleTexts_1" transform="scale({{textAndSloganScale}}) translate({{textAndSloganX}},{{textAndSloganY}})">';

			if (logoObj.templatePath.isDBLineCompanyText == "yes") {
				template += '<g class="logo--name svgLogoName_1 logoNameBox1" transform="scale({{text1Scale}}) translate({{text1X}},{{text1Y}})" fill="{{text1Fill}}">{{text1Html}}</g>';

				template += '<g class="logo--name svgLogoName_2 logoNameBox2" transform="scale({{text2Scale}}) translate({{text2X}},{{text2Y}})" fill="{{text2Fill}}">{{text2Html}}</g>';
			} else {
				template += '<g class="logo--name svgLogoName_1 logoNameBox" transform="scale({{textScale}}) translate({{textX}},{{textY}})" fill="{{textFill}}">{{textHtml}}</g>';
			}

			template += '<g id="" class="logo--name svgSloganText_1 sloganBox" transform="scale({{sloganScale}}) translate({{sloganX}},{{sloganY}})" fill="{{sloganFill}}">{{sloganHtml}}</g>';
			template += '</g>';
			template += '</g>';
			template += '</g>';
			template += '</svg>';

			if (logoObj.textGradient != "") {
				logoObj.mainTextColor = 'url(#textGradient' + idKey + ')';
			}
			if ((logoObj.templatePath.isDBLineCompanyText == "yes") && (logoObj.text2Gradient != "")) {
				logoObj.mainText2Color = 'url(#text2Gradient' + idKey + ')';
			}

			if (logoObj.sloganGradient != "") {
				logoObj.sloganTextColor = 'url(#sloganGradient' + idKey + ')';
			}
			if (logoObj.frameGradient != "") {
				logoObj.frameColor = 'url(#frameGradient' + idKey + ')';
			}
			if (logoObj.iconFrameGradient != "") {
				logoObj.iconFrameColor = 'url(#iconFrameGradient' + idKey + ')';
			}
			if (logoObj.iconGradient != "") {
				logoObj.iconColor = 'url(#iconGradient' + idKey + ')';
			}
			if (logoObj.frameFilledGradient != "" && logoObj.templatePath.frameType == "filled") {
				logoObj.frameFilledColor = 'url(#frameGradient' + idKey + ')';
			}

			//apply gradients to the template

			template = this.applyGradientToTemplate(template, logoObj, idKey);


			template = template.replace("{{svgColor}}", logoObj.bgColor);

			if (logoObj.templatePath.isDBLineCompanyText == "yes") {
				template = template.replace("{{text1Html}}", logoObj.logoPath1);
				template = template.replace("{{text2Html}}", logoObj.logoPath2);

				template = template.replace("{{text1Fill}}", logoObj.mainTextColor);
				template = template.replace("{{text2Fill}}", logoObj.mainText2Color);

			} else {
				template = template.replace("{{textHtml}}", logoObj.logoPath);
				template = template.replace("{{textFill}}", logoObj.mainTextColor);
			}


			template = template.replace("{{sloganHtml}}", logoObj.sloganPath);
			template = template.replace("{{sloganFill}}", logoObj.sloganTextColor);

			template = template.replace("{{frameHtml}}", logoObj.framePath);

			if (logoObj.templatePath.frameType == "filled") {
				//	alert(logoObj.frameFilledColor);
				template = template.replace("{{frameFill}}", logoObj.frameFilledColor);
			} else {
				template = template.replace("{{frameFill}}", logoObj.frameColor);
			}
			if (logoObj.templatePath.isIcon == 1 || logoObj.templatePath.isMono == 1) {
				template = template.replace("{{iconHtml}}", logoObj.iconPath);
				template = template.replace("{{iconFill}}", logoObj.iconColor);
				template = template.replace("{{iconX}}", logoObj.templatePath.icon.x);
				template = template.replace("{{iconY}}", logoObj.templatePath.icon.y);
				template = template.replace("{{iconScale}}", logoObj.templatePath.icon.scale);

				template = template.replace("{{iconFrameFill}}", logoObj.iconFrameColor);
				template = template.replace("{{iconFrameBoxX}}", logoObj.templatePath.iconFrameBox.x);
				template = template.replace("{{iconFrameBoxY}}", logoObj.templatePath.iconFrameBox.y);
				template = template.replace("{{iconFrameBoxScale}}", logoObj.templatePath.iconFrameBox.scale);
			}
			if (logoObj.templatePath.isIconFrame == 1) {
				template = template.replace("{{iconFrameHtml}}", logoObj.iconFramePath);
				template = template.replace("{{iconFrameFill}}", logoObj.iconFrameColor);
				template = template.replace("{{iconFrameX}}", logoObj.templatePath.iconFrame.x);
				template = template.replace("{{iconFrameY}}", logoObj.templatePath.iconFrame.y);
				template = template.replace("{{iconFrameScale}}", logoObj.templatePath.iconFrame.scale);
			}

			if (logoObj.templatePath.isDBLineCompanyText == "yes") {
				template = template.replace("{{text1X}}", logoObj.templatePath.text1.x);
				template = template.replace("{{text1Y}}", logoObj.templatePath.text1.y);
				template = template.replace("{{text1Scale}}", logoObj.templatePath.text1.scale);

				template = template.replace("{{text2X}}", logoObj.templatePath.text2.x);
				template = template.replace("{{text2Y}}", logoObj.templatePath.text2.y);
				template = template.replace("{{text2Scale}}", logoObj.templatePath.text2.scale);
			} else {
				template = template.replace("{{textX}}", logoObj.templatePath.text.x);
				template = template.replace("{{textY}}", logoObj.templatePath.text.y);
				template = template.replace("{{textScale}}", logoObj.templatePath.text.scale);
			}



			template = template.replace("{{sloganX}}", logoObj.templatePath.slogan.x);
			template = template.replace("{{sloganY}}", logoObj.templatePath.slogan.y);
			template = template.replace("{{sloganScale}}", logoObj.templatePath.slogan.scale);

			template = template.replace("{{textAndSloganX}}", logoObj.templatePath.textAndSlogan.x);
			template = template.replace("{{textAndSloganY}}", logoObj.templatePath.textAndSlogan.y);
			template = template.replace("{{textAndSloganScale}}", logoObj.templatePath.textAndSlogan.scale);

			template = template.replace("{{containerBodyX}}", logoObj.templatePath.containerBody.x);
			template = template.replace("{{containerBodyY}}", logoObj.templatePath.containerBody.y);
			template = template.replace("{{containerBodyScale}}", logoObj.templatePath.containerBody.scale);

			template = template.replace("{{logoContainerX}}", logoObj.templatePath.logoContainer.x);
			template = template.replace("{{logoContainerY}}", logoObj.templatePath.logoContainer.y);
			template = template.replace("{{logoContainerScale}}", logoObj.templatePath.logoContainer.scale);

			template = template.replace("{{frameX}}", logoObj.templatePath.frame.x);
			template = template.replace("{{frameY}}", logoObj.templatePath.frame.y);
			template = template.replace("{{frameScale}}", logoObj.templatePath.frame.scale);
			return template;

		},
        /**
		 * 
		 * @param {*} type 
		 */
		getGradientStops: function (type) {
			var stops = '';
			var gradientStops = gradientsArray[type] ? gradientsArray[type].stops : [];

			stops = gradientStops.reduce((accm, item) => {
				return accm + '<stop offset="' + item.offset + '" stop-color="' + item.color + '" />';
			}, '');

			return stops;
		},
        /**
		 * 
		 * @param {*} template 
		 * @param {*} logoObj 
		 * @param {*} idKey 
		 */
		applyGradientToTemplate: function (template, logoObj, idKey) {
			// Company text gradient section
			// debugConsole("applyGradientToTemplate", true);

			// debugConsole("logoObj.textGradient:="+logoObj.textGradient);
			// debugConsole("logoObj.text2Gradient:="+logoObj.text2Gradient);

			if (!logoObj.textGradient || logoObj.textGradient == '') {
				template = template.replace("{{textGradient}}", '');
				// debugConsole("textGradient template1:="+template);
			}
			else {
				var stops = this.getGradientStops(logoObj.textGradient);
				// debugConsole("applyGradientToTemplate stops"+stops, true);

				template = template.replace("{{textGradient}}", '<defs><linearGradient id="textGradient' + idKey + '">' + stops + '</linearGradient></defs>');
				// debugConsole("textGradient template2:="+template);
			}
			// Company text2 gradient section
			// debugConsole("logoObj.templatePath.isDBLineCompanyText:="+logoObj.templatePath.isDBLineCompanyText);
			if (logoObj.templatePath.isDBLineCompanyText == "yes") {
				if (!logoObj.text2Gradient || logoObj.text2Gradient == '') {
					template = template.replace("{{text2Gradient}}", '');
					// debugConsole("text2Gradient template1:="+template);
				}
				else {
					var stops = this.getGradientStops(logoObj.text2Gradient);


					template = template.replace("{{text2Gradient}}", '<defs><linearGradient id="text2Gradient' + idKey + '">' + stops + '</linearGradient></defs>');
					// debugConsole("text2Gradient template2:="+template);
				}
			}

			//Slogan text gradient section
			if (!logoObj.sloganGradient || logoObj.sloganGradient == '') {
				template = template.replace("{{sloganGradient}}", '');
			}
			else {
				var stops = this.getGradientStops(logoObj.sloganGradient);

				template = template.replace("{{sloganGradient}}", '<defs><linearGradient id="sloganGradient' + idKey + '">' + stops + '</linearGradient></defs>');
			}
			// Frame gradient section
			if (logoObj.templatePath.frameType == "filled") {
				if (!logoObj.frameFilledGradient || logoObj.frameFilledGradient == '') {
					template = template.replace("{{frameGradient}}", '');
				}
				else {
					var stops = this.getGradientStops(logoObj.frameFilledGradient);

					template = template.replace("{{frameGradient}}", '<defs><linearGradient id="frameGradient' + idKey + '">' + stops + '</linearGradient></defs>');
				}
			}
			else {
				if (!logoObj.frameGradient || logoObj.frameGradient == '') {
					template = template.replace("{{frameGradient}}", '');
				}
				else {
					var stops = this.getGradientStops(logoObj.frameGradient);

					template = template.replace("{{frameGradient}}", '<defs><linearGradient id="frameGradient' + idKey + '">' + stops + '</linearGradient></defs>');
				}
			}

			if (!logoObj.iconFrameGradient || logoObj.iconFrameGradient == '') {
				template = template.replace("{{iconFrameGradient}}", '');
			}
			else {
				var stops = this.getGradientStops(logoObj.iconFrameGradient);

				template = template.replace("{{iconFrameGradient}}", '<defs><linearGradient id="iconFrameGradient' + idKey + '">' + stops + '</linearGradient></defs>');
			}

			if (logoObj.templatePath.isIcon == 1 || logoObj.templatePath.isMono == 1) {
				if (!logoObj.iconGradient || logoObj.iconGradient == '') {
					template = template.replace("{{iconGradient}}", '');
				}
				else {
					var stops = this.getGradientStops(logoObj.iconGradient);

					template = template.replace("{{iconGradient}}", '<defs><linearGradient id="iconGradient' + idKey + '">' + stops + '</linearGradient></defs>');
				}
			}

			return template;
		},
		/**
		 * updated svg by single type as frame, company name, iconframe , slogan name 
		 * @param {*} currLogo 
		 * @param {*} $for 
		 * @param {*} idKey 
		 */
		generateLogoTemplateByOption: function (currLogo, $for, idKey, p_oCurrContainerBodyObj, p_oCurrLogoContainerObj, p_sActionType = "") {

			debugConsole("generateLogoTemplateByOption for:=" + $for + ",,,," + p_oCurrContainerBodyObj + ",,,," + p_oCurrLogoContainerObj + ",,,p_sActionType:=" + p_sActionType);
			if ($for != 'frame') {
				currLogo = updateCurrLogoObject(currLogo);
			} else {
				if (typeof currLogo.generate.templatePath.updates.frame === "undefined") {
					currLogo.generate.templatePath.updates.frame = {};
				}
			}
			var logoObj = currLogo.generate;
			if (typeof logoObj.templatePath.iconFrameBox === 'undefined') {
				logoObj.templatePath.iconFrameBox = {};
				logoObj.templatePath.iconFrameBox.x = 0;
				logoObj.templatePath.iconFrameBox.y = 0;
				logoObj.templatePath.iconFrameBoxScale = 1;

				logoObj.templatePath.updates.iconFrameBox = {};
				logoObj.templatePath.updates.iconFrameBox.x = 0;
				logoObj.templatePath.updates.iconFrameBox.y = 0;
				logoObj.templatePath.updates.iconFrameBox.scale = 1;
			}
			var obj = {};
			var getSVGTag = logoMakerFunction.getDynamicSvgTag();
			// debugConsole("getSVGTag:="+getSVGTag);
			var template = null;
			if (getSVGTag != "") {
				template = getSVGTag;
			} else {
				template = '<svg version="1.1" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" height="100%" width="100%" x="0px" y="0px" viewBox="0 0 ' + constantVars.VIEWBOXWIDTH + ' ' + constantVars.VIEWBOXHEIGHT + '" xml:space="preserve" preserveAspectRatio="xMidYMid meet" class="">{{textGradient}}{{text2Gradient}}{{sloganGradient}}{{iconGradient}}{{frameGradient}}{{iconFrameGradient}}';
			}

			template += '<rect x="0px" y="0px" width="100%" height="100%" fill="{{svgColor}}"/>';
			template += '<g class="logo-container-box logoContainerBox" transform="scale({{logoContainerScale}}) translate({{logoContainerX}},{{logoContainerY}})">';
			if (logoObj.templatePath.isFrame == 1) {
				template += '<g class="container_1" transform="scale({{frameScale}}) translate({{frameX}},{{frameY}})"  fill="{{frameFill}}">{{frameHtml}}</g>';
			}
			template += '<g class="containerBody" transform="scale({{containerBodyScale}}) translate({{containerBodyX}},{{containerBodyY}})" >';
			if (logoObj.templatePath.isIcon == 1 || logoObj.templatePath.isMono == 1) {
				template += '<g class="sampleIconBox" transform="scale({{iconFrameBoxScale}}) translate({{iconFrameBoxX}},{{iconFrameBoxY}})">';
				if (logoObj.templatePath.isIconFrame == 1) {
					template += '<g class="iconFrame" transform="scale({{iconFrameScale}}) translate({{iconFrameX}},{{iconFrameY}})"  fill="{{iconFrameFill}}">{{iconFrameHtml}}</g>';
				}
				template += '<g class="sampleIcons_1" transform="scale({{iconScale}}) translate({{iconX}},{{iconY}})" fill="{{iconFill}}">{{iconHtml}}</g>';
				template += '</g>';
			}
			template += '<g class="sampleTexts_1" transform="scale({{textAndSloganScale}}) translate({{textAndSloganX}},{{textAndSloganY}})">';

			if (logoObj.templatePath.isDBLineCompanyText == "yes") {
				template += '<g class="logo--name svgLogoName_1 logoNameBox1" transform="scale({{text1Scale}}) translate({{text1X}},{{text1Y}})" fill="{{text1Fill}}">{{text1Html}}</g>';

				template += '<g class="logo--name svgLogoName_2 logoNameBox2" transform="scale({{text2Scale}}) translate({{text2X}},{{text2Y}})" fill="{{text2Fill}}">{{text2Html}}</g>';
			} else {
				template += '<g class="logo--name svgLogoName_1 logoNameBox" transform="scale({{textScale}}) translate({{textX}},{{textY}})" fill="{{textFill}}">{{textHtml}}</g>';
			}

			template += '<g id="" class="logo--name svgSloganText_1 sloganBox" transform="scale({{sloganScale}}) translate({{sloganX}},{{sloganY}})" fill="{{sloganFill}}">{{sloganHtml}}</g>';
			template += '</g>';
			template += '</g>';
			template += '</g>';
			template += '</svg>';

			if (logoObj.textGradient != "") {
				logoObj.mainTextColor = 'url(#textGradient' + idKey + ')';
			}

			if ((logoObj.templatePath.isDBLineCompanyText == "yes") && (logoObj.text2Gradient != "")) {
				logoObj.mainText2Color = 'url(#text2Gradient' + idKey + ')';
			}
			if (logoObj.sloganGradient != "") {
				logoObj.sloganTextColor = 'url(#sloganGradient' + idKey + ')';
			}
			if (logoObj.frameGradient != "") {
				logoObj.frameColor = 'url(#frameGradient' + idKey + ')';
			}
			if (logoObj.iconGradient != "") {
				logoObj.iconColor = 'url(#iconGradient' + idKey + ')';
			}
			if (logoObj.iconFrameGradient != "") {
				logoObj.iconFrameColor = 'url(#iconFrameGradient' + idKey + ')';
			}
			if (logoObj.frameFilledGradient != "" && logoObj.templatePath.frameType == "filled") {
				logoObj.frameFilledColor = 'url(#frameGradient' + idKey + ')';
			}

			//apply gradient to template
			template = this.applyGradientToTemplate(template, logoObj, idKey);

			template = template.replace("{{svgColor}}", logoObj.bgColor);

			if (logoObj.templatePath.isDBLineCompanyText == "yes") {
				template = template.replace("{{text1Html}}", logoObj.logoPath1);
				template = template.replace("{{text2Html}}", logoObj.logoPath2);

				template = template.replace("{{text1Fill}}", logoObj.mainTextColor);
				template = template.replace("{{text2Fill}}", logoObj.mainText2Color);
			} else {
				template = template.replace("{{textHtml}}", logoObj.logoPath);
				template = template.replace("{{textFill}}", logoObj.mainTextColor);
			}


			template = template.replace("{{sloganHtml}}", logoObj.sloganPath);
			template = template.replace("{{sloganFill}}", logoObj.sloganTextColor);

			template = template.replace("{{frameHtml}}", logoObj.framePath);

			debugConsole("logoObj.templatePath.frameType:=" + logoObj.templatePath.frameType);
			if (logoObj.templatePath.frameType == "filled") {
				//	alert(logoObj.frameFilledColor);
				template = template.replace("{{frameFill}}", logoObj.frameFilledColor);
			} else {
				if (logoObj.bgColor == "#000000" || logoObj.bgColor == "#000" || logoObj.bgColor == "black") {
					if (removeMultipleSpaces(logoObj.frameColor) == "" || logoObj.frameColor == logoObj.bgColor) {
						logoObj.frameColor = "#ffffff";
					}
				}
				template = template.replace("{{frameFill}}", logoObj.frameColor);
			}
			if (logoObj.templatePath.isIcon == 1 || logoObj.templatePath.isMono == 1) {
				template = template.replace("{{iconHtml}}", logoObj.iconPath);
				template = template.replace("{{iconFill}}", logoObj.iconColor);
				template = template.replace("{{iconX}}", logoObj.templatePath.icon.x);
				template = template.replace("{{iconY}}", logoObj.templatePath.icon.y);
				template = template.replace("{{iconScale}}", logoObj.templatePath.icon.scale);
				template = template.replace("{{iconFrameFill}}", logoObj.iconFrameColor);
				template = template.replace("{{iconFrameBoxX}}", logoObj.templatePath.iconFrameBox.x);
				template = template.replace("{{iconFrameBoxY}}", logoObj.templatePath.iconFrameBox.y);
				if (logoObj.templatePath.isIconFrame == 1) {
					template = template.replace("{{iconFrameBoxScale}}", logoObj.templatePath.iconFrameBox.scale);
				} else {
					debugConsole("logoObj.templatePath.iconFrameBoxScale:=" + logoObj.templatePath.iconFrameBoxScale)
					template = template.replace("{{iconFrameBoxScale}}", logoObj.templatePath.iconFrameBoxScale);
				}

			}
			if (logoObj.templatePath.isIconFrame == 1) {
				template = template.replace("{{iconFrameHtml}}", logoObj.iconFramePath);
				template = template.replace("{{iconFrameFill}}", logoObj.iconFrameColor);
				template = template.replace("{{iconFrameX}}", logoObj.templatePath.iconFrame.x);
				template = template.replace("{{iconFrameY}}", logoObj.templatePath.iconFrame.y);
				template = template.replace("{{iconFrameScale}}", logoObj.templatePath.iconFrame.scale);
			}
			if (logoObj.templatePath.isDBLineCompanyText == "yes") {
				template = template.replace("{{text1X}}", logoObj.templatePath.text1.x);
				template = template.replace("{{text1Y}}", logoObj.templatePath.text1.y);
				template = template.replace("{{text1Scale}}", logoObj.templatePath.text1.scale);
				debugConsole("debug1");

				template = template.replace("{{text2X}}", logoObj.templatePath.text2.x);
				template = template.replace("{{text2Y}}", logoObj.templatePath.text2.y);
				template = template.replace("{{text2Scale}}", logoObj.templatePath.text2.scale);
				debugConsole("debug2");

			} else {
				template = template.replace("{{textX}}", logoObj.templatePath.text.x);
				template = template.replace("{{textY}}", logoObj.templatePath.text.y);
				template = template.replace("{{textScale}}", logoObj.templatePath.text.scale);
			}
			debugConsole("debug2.1");

			template = template.replace("{{sloganX}}", logoObj.templatePath.slogan.x);
			template = template.replace("{{sloganY}}", logoObj.templatePath.slogan.y);
			template = template.replace("{{sloganScale}}", logoObj.templatePath.slogan.scale);
			debugConsole("debug2.2");

			template = template.replace("{{textAndSloganX}}", logoObj.templatePath.textAndSlogan.x);
			template = template.replace("{{textAndSloganY}}", logoObj.templatePath.textAndSlogan.y);
			template = template.replace("{{textAndSloganScale}}", logoObj.templatePath.textAndSlogan.scale);

			template = template.replace("{{containerBodyX}}", logoObj.templatePath.containerBody.x);
			template = template.replace("{{containerBodyY}}", logoObj.templatePath.containerBody.y);
			template = template.replace("{{containerBodyScale}}", logoObj.templatePath.containerBody.scale);

			template = template.replace("{{logoContainerX}}", logoObj.templatePath.logoContainer.x);
			template = template.replace("{{logoContainerY}}", logoObj.templatePath.logoContainer.y);
			template = template.replace("{{logoContainerScale}}", logoObj.templatePath.logoContainer.scale);

			template = template.replace("{{frameX}}", logoObj.templatePath.frame.x);
			template = template.replace("{{frameY}}", logoObj.templatePath.frame.y);

			if (logoObj.templatePath.frame.scale) {
				debugConsole("logoObj.templatePath.frame.scale:=" + logoObj.templatePath.frame.scale);
				template = template.replace("{{frameScale}}", logoObj.templatePath.frame.scale);
			} else {
				template = template.replace("{{frameScale}}", 1);
			}

			debugConsole("debug2.2pppp");
			$("#templateGenerator").html(template);
			debugConsole("debug2.2qqq");
			debugConsole("logoObj.templatePath.containerBody.scale:=" + logoObj.templatePath.containerBody.scale);


			if ($for == 'frame') {
				if (logoObj.templatePath.isFrame == 1) {

					if (logoObj.templatePath.isEqual == 1 && logoObj.templatePath.sloganSetAsPerText == 1 && logoMakerFunction.checkTemplateIsEqualCondition(logoObj) && p_sActionType == "addOuterContainer") {
						var textGSloganWidthDiff = 1;
						var sloganGTextWidthDiff = 1;

						var isEqualCaseTextWidth;
						if (logoObj.templatePath.isDBLineCompanyText == "yes") {
							isEqualCaseTextWidth = Math.max(parseInt($('#templateGenerator  .svgLogoName_1').get(0).getBBox().width), parseInt($('#templateGenerator  .svgLogoName_2').get(0).getBBox().width))
						} else {
							isEqualCaseTextWidth = parseInt($('#templateGenerator  .svgLogoName_1').get(0).getBBox().width);
						}
						var isEqualCaseSloganWidth = parseInt($('#templateGenerator  .svgSloganText_1').get(0).getBBox().width);
						debugConsole("isEqualCaseTextWidth1:=" + isEqualCaseTextWidth);
						debugConsole("isEqualCaseSloganWidth1:=" + isEqualCaseSloganWidth);
						if (isEqualCaseTextWidth > isEqualCaseSloganWidth) {
							textGSloganWidthDiff = (isEqualCaseTextWidth / isEqualCaseSloganWidth);
						} else {
							sloganGTextWidthDiff = (isEqualCaseSloganWidth / isEqualCaseTextWidth);
						}

						if (logoObj.templatePath.isDBLineCompanyText == "yes") {
							obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text1', sloganGTextWidthDiff);
							logoObj.templatePath.updates.text1.x = obj.x;
							logoObj.templatePath.updates.text1.y = obj.y;
							logoObj.templatePath.updates.text1.scale = obj.scale;

							obj = updateGroupSize($('#templateGenerator  .svgLogoName_2'), logoObj.templatePath, 'text2', sloganGTextWidthDiff);
							logoObj.templatePath.updates.text2.x = obj.x;
							logoObj.templatePath.updates.text2.y = obj.y;
							logoObj.templatePath.updates.text2.scale = obj.scale;
						} else {
							obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text', sloganGTextWidthDiff);
							logoObj.templatePath.updates.text.x = obj.x;
							logoObj.templatePath.updates.text.y = obj.y;
							logoObj.templatePath.updates.text.scale = obj.scale;
						}
						obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', textGSloganWidthDiff);
						logoObj.templatePath.updates.slogan.x = obj.x;
						logoObj.templatePath.updates.slogan.y = obj.y;
						logoObj.templatePath.updates.slogan.scale = obj.scale;

					} else {
						if (lEditor.currentLogo.generate.textSloganDistSlider > constantVars.ORIGINAL_SPACING.textSloganDistSlider && (lEditor.currentLogo.generate.templatePath.isIcon == 1 || lEditor.currentLogo.generate.templatePath.isMono == 1) && (p_sActionType == "addOuterContainer")) {
							obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', 0);
							logoObj.templatePath.updates.slogan.x = obj.x;
							logoObj.templatePath.updates.slogan.y = obj.y;
							logoObj.templatePath.updates.slogan.scale = obj.scale;
						}
					}

					if (p_sActionType == "addOuterContainer") {
						if ((logoObj.templatePath.isIcon == 1) || (logoObj.templatePath.isMono == 1)) {
							if (logoObj.templatePath.isIconFrame == 1) {
								obj = updateCurrentIconSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, constantVars.ORIGINAL_SPACING.logoSizeSlider, 'iconFrameBox');
								logoObj.templatePath.updates.iconFrameBox.x = obj.x;
								logoObj.templatePath.updates.iconFrameBox.y = obj.y;
								logoObj.templatePath.updates.iconFrameBox.scale = obj.scale;
							} else {
								obj = updateCurrentIconSize($('#templateGenerator  .sampleIcons_1'), logoObj.templatePath, constantVars.ORIGINAL_SPACING.logoSizeSlider, 'icon');

								logoObj.templatePath.updates.icon.x = obj.x;
								logoObj.templatePath.updates.icon.y = obj.y;
								logoObj.templatePath.updates.icon.scale = obj.scale;
							}
						}
					}

					obj = updateGroupSize($('#templateGenerator  .container_1'), logoObj.templatePath, 'frame', 0);
					logoObj.templatePath.updates.frame.x = obj.x;
					logoObj.templatePath.updates.frame.y = obj.y;
					logoObj.templatePath.updates.frame.scale = obj.scale;

					if (p_oCurrContainerBodyObj) {
						obj = updateGroupSizeByLastValue($('#templateGenerator  .containerBody'), p_oCurrContainerBodyObj)
						debugConsole("p_oCurrContainerBodyObj.scale:=" + p_oCurrContainerBodyObj.scale);
					} else {
						obj = updateGroupSize($('#templateGenerator  .containerBody'), logoObj.templatePath, 'containerBody', 0);
						debugConsole("obj.scale:=" + obj.scale);
					}
					logoObj.templatePath.updates.containerBody.x = obj.x;
					logoObj.templatePath.updates.containerBody.y = obj.y;
					logoObj.templatePath.updates.containerBody.scale = obj.scale;

					if (p_oCurrLogoContainerObj) {
						obj = updateGroupSizeByLastValue($('#templateGenerator  .logoContainerBox'), p_oCurrLogoContainerObj)
						debugConsole("p_oCurrLogoContainerObj.scale:=" + p_oCurrLogoContainerObj.scale);
					} else {
						obj = updateGroupSize($('#templateGenerator  .logoContainerBox'), logoObj.templatePath, 'logoContainer', 0);
					}
					logoObj.templatePath.updates.logoContainer.x = obj.x;
					logoObj.templatePath.updates.logoContainer.y = obj.y;
					logoObj.templatePath.updates.logoContainer.scale = obj.scale;
				}
			}

			if ($for == 'logoName' || $for == "logoName2" || $for == "logoName1") {
				debugConsole("debug3");
				if (logoObj.templatePath.isEqual == 1) {
					debugConsole("p_sActionType:=" + p_sActionType + ",,,sloganSetAsPerText:=" + logoObj.templatePath.sloganSetAsPerText);
					switch (p_sActionType) {
						case "logoNameFont":
							if (logoObj.templatePath.sloganSetAsPerText == 1) {
								var textGSloganWidthDiff = 1;
								var sloganGTextWidthDiff = 1;
								if (logoMakerFunction.checkTemplateIsEqualCondition(logoObj)) {
									var isEqualCaseTextWidth = 0;
									if (logoObj.templatePath.isDBLineCompanyText == "yes") {
										isEqualCaseTextWidth = Math.max(parseInt($('#templateGenerator  .svgLogoName_1').get(0).getBBox().width), parseInt($('#templateGenerator  .svgLogoName_2').get(0).getBBox().width))
									} else {
										isEqualCaseTextWidth = parseInt($('#templateGenerator  .svgLogoName_1').get(0).getBBox().width);
									}

									var isEqualCaseSloganWidth = parseInt($('#templateGenerator  .svgSloganText_1').get(0).getBBox().width);
									debugConsole("isEqualCaseTextWidth:=" + isEqualCaseTextWidth);
									debugConsole("isEqualCaseSloganWidth:=" + isEqualCaseSloganWidth);
									if (isEqualCaseTextWidth > isEqualCaseSloganWidth) {
										textGSloganWidthDiff = (isEqualCaseTextWidth / isEqualCaseSloganWidth);
									} else {
										sloganGTextWidthDiff = (isEqualCaseSloganWidth / isEqualCaseTextWidth);
									}

									if (logoObj.templatePath.isDBLineCompanyText == "yes") {
										obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text1', sloganGTextWidthDiff);
										logoObj.templatePath.updates.text1.x = obj.x;
										logoObj.templatePath.updates.text1.y = obj.y;
										logoObj.templatePath.updates.text1.scale = obj.scale;

										obj = updateGroupSize($('#templateGenerator  .svgLogoName_2'), logoObj.templatePath, 'text2', sloganGTextWidthDiff);
										logoObj.templatePath.updates.text2.x = obj.x;
										logoObj.templatePath.updates.text2.y = obj.y;
										logoObj.templatePath.updates.text2.scale = obj.scale;
									} else {
										obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text', sloganGTextWidthDiff);
										logoObj.templatePath.updates.text.x = obj.x;
										logoObj.templatePath.updates.text.y = obj.y;
										logoObj.templatePath.updates.text.scale = obj.scale;
									}

									obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', textGSloganWidthDiff);
									logoObj.templatePath.updates.slogan.x = obj.x;
									logoObj.templatePath.updates.slogan.y = obj.y;
									logoObj.templatePath.updates.slogan.scale = obj.scale;
								} else {
									if (logoObj.templatePath.isDBLineCompanyText == "yes") {
										obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text1', 0);
										logoObj.templatePath.updates.text1.x = obj.x;
										logoObj.templatePath.updates.text1.y = obj.y;
										logoObj.templatePath.updates.text1.scale = obj.scale;

										obj = updateGroupSize($('#templateGenerator  .svgLogoName_2'), logoObj.templatePath, 'text2', 0);
										logoObj.templatePath.updates.text2.x = obj.x;
										logoObj.templatePath.updates.text2.y = obj.y;
										logoObj.templatePath.updates.text2.scale = obj.scale;
									} else {
										obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text', 0);
										logoObj.templatePath.updates.text.x = obj.x;
										logoObj.templatePath.updates.text.y = obj.y;
										logoObj.templatePath.updates.text.scale = obj.scale;
									}

									obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', 0);
									logoObj.templatePath.updates.slogan.x = obj.x;
									logoObj.templatePath.updates.slogan.y = obj.y;
									logoObj.templatePath.updates.slogan.scale = obj.scale;

									obj = updateGroupSize($('#templateGenerator  .sampleTexts_1'), logoObj.templatePath, 'textAndSlogan', 0);
									logoObj.templatePath.updates.textAndSlogan.x = obj.x;
									logoObj.templatePath.updates.textAndSlogan.y = obj.y;
									logoObj.templatePath.updates.textAndSlogan.scale = obj.scale;
								}
							}
							else {
								if (logoObj.templatePath.isDBLineCompanyText == "yes") {
									obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text1', 0);
									logoObj.templatePath.updates.text1.x = obj.x;
									logoObj.templatePath.updates.text1.y = obj.y;
									logoObj.templatePath.updates.text1.scale = obj.scale;

									obj = updateGroupSize($('#templateGenerator  .svgLogoName_2'), logoObj.templatePath, 'text2', 0);
									logoObj.templatePath.updates.text2.x = obj.x;
									logoObj.templatePath.updates.text2.y = obj.y;
									logoObj.templatePath.updates.text2.scale = obj.scale;
								} else {
									obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text', 0);
									logoObj.templatePath.updates.text.x = obj.x;
									logoObj.templatePath.updates.text.y = obj.y;
									logoObj.templatePath.updates.text.scale = obj.scale;
								}

								obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', 0);
								logoObj.templatePath.updates.slogan.x = obj.x;
								logoObj.templatePath.updates.slogan.y = obj.y;
								logoObj.templatePath.updates.slogan.scale = obj.scale;

								obj = updateGroupSize($('#templateGenerator  .sampleTexts_1'), logoObj.templatePath, 'textAndSlogan', 0);
								logoObj.templatePath.updates.textAndSlogan.x = obj.x;
								logoObj.templatePath.updates.textAndSlogan.y = obj.y;
								logoObj.templatePath.updates.textAndSlogan.scale = obj.scale;
							}
							if (logoObj.templatePath.isFrame == 1) {
								obj = updateGroupSize($('#templateGenerator  .containerBody'), logoObj.templatePath, 'containerBody', 0);
								logoObj.templatePath.updates.containerBody.x = obj.x;
								logoObj.templatePath.updates.containerBody.y = obj.y;
								logoObj.templatePath.updates.containerBody.scale = obj.scale;
							} else {
								obj = updateGroupSize($('#templateGenerator  .logoContainerBox'), logoObj.templatePath, 'logoContainer', 0);
								logoObj.templatePath.updates.logoContainer.x = obj.x;
								logoObj.templatePath.updates.logoContainer.y = obj.y;
								logoObj.templatePath.updates.logoContainer.scale = obj.scale;
							}
							break;
						case "logoLetterSpacing":
						case "logoTextSlider":
						case "logoNameChange":
						default:
							if (logoObj.templatePath.isDBLineCompanyText == "yes") {
								debugConsole("debug6")
								obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text1', 0);
								logoObj.templatePath.updates.text1.x = obj.x;
								logoObj.templatePath.updates.text1.y = obj.y;
								logoObj.templatePath.updates.text1.scale = obj.scale;

								obj = updateGroupSize($('#templateGenerator  .svgLogoName_2'), logoObj.templatePath, 'text2', 0);
								logoObj.templatePath.updates.text2.x = obj.x;
								logoObj.templatePath.updates.text2.y = obj.y;
								logoObj.templatePath.updates.text2.scale = obj.scale;
							} else {
								obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text', 0);
								logoObj.templatePath.updates.text.x = obj.x;
								logoObj.templatePath.updates.text.y = obj.y;
								logoObj.templatePath.updates.text.scale = obj.scale;
							}
							break;
					}
				} else {
					debugConsole("debug5");
					if (logoObj.templatePath.isDBLineCompanyText == "yes") {
						obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text1', 0);
						logoObj.templatePath.updates.text1.x = obj.x;
						logoObj.templatePath.updates.text1.y = obj.y;
						logoObj.templatePath.updates.text1.scale = obj.scale;

						obj = updateGroupSize($('#templateGenerator  .svgLogoName_2'), logoObj.templatePath, 'text2', 0);
						logoObj.templatePath.updates.text2.x = obj.x;
						logoObj.templatePath.updates.text2.y = obj.y;
						logoObj.templatePath.updates.text2.scale = obj.scale;
					} else {
						obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text', 0);
						logoObj.templatePath.updates.text.x = obj.x;
						logoObj.templatePath.updates.text.y = obj.y;
						logoObj.templatePath.updates.text.scale = obj.scale;
					}
					if (p_sActionType == "logoNameFont") {
						obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', 0);
						logoObj.templatePath.updates.slogan.x = obj.x;
						logoObj.templatePath.updates.slogan.y = obj.y;
						logoObj.templatePath.updates.slogan.scale = obj.scale;

						obj = updateGroupSize($('#templateGenerator  .sampleTexts_1'), logoObj.templatePath, 'textAndSlogan', 0);
						logoObj.templatePath.updates.textAndSlogan.x = obj.x;
						logoObj.templatePath.updates.textAndSlogan.y = obj.y;
						logoObj.templatePath.updates.textAndSlogan.scale = obj.scale;

						if (logoObj.templatePath.isFrame == 1) {
							obj = updateGroupSize($('#templateGenerator  .containerBody'), logoObj.templatePath, 'containerBody', 0);
							logoObj.templatePath.updates.containerBody.x = obj.x;
							logoObj.templatePath.updates.containerBody.y = obj.y;
							logoObj.templatePath.updates.containerBody.scale = obj.scale;
						} else {
							obj = updateGroupSize($('#templateGenerator  .logoContainerBox'), logoObj.templatePath, 'logoContainer', 0);
							logoObj.templatePath.updates.logoContainer.x = obj.x;
							logoObj.templatePath.updates.logoContainer.y = obj.y;
							logoObj.templatePath.updates.logoContainer.scale = obj.scale;
						}
					}
				}
			}

			if ($for == 'sloganName') {
				debugConsole("p_sActionType:=" + p_sActionType + ",,,sloganSetAsPerText:=" + logoObj.templatePath.sloganSetAsPerText);
				debugConsole("logoObj.templatePath.isEqual:=" + logoObj.templatePath.isEqual);
				; if (logoObj.templatePath.isEqual == 1) {
					switch (p_sActionType) {
						case "sloganNameFont":
							if (logoObj.templatePath.sloganSetAsPerText == 1) {
								; var textGSloganWidthDiff = 1;
								var sloganGTextWidthDiff = 1;
								if (logoMakerFunction.checkTemplateIsEqualCondition(logoObj)) {
									var isEqualCaseTextWidth = 0;
									if (logoObj.templatePath.isDBLineCompanyText == "yes") {
										isEqualCaseTextWidth = Math.max(parseInt($('#templateGenerator  .svgLogoName_1').get(0).getBBox().width), parseInt($('#templateGenerator  .svgLogoName_2').get(0).getBBox().width))
									} else {
										isEqualCaseTextWidth = parseInt($('#templateGenerator  .svgLogoName_1').get(0).getBBox().width);
									}

									var isEqualCaseSloganWidth = parseInt($('#templateGenerator  .svgSloganText_1').get(0).getBBox().width);
									debugConsole("isEqualCaseTextWidth:=" + isEqualCaseTextWidth);
									debugConsole("isEqualCaseSloganWidth:=" + isEqualCaseSloganWidth);
									if (isEqualCaseTextWidth > isEqualCaseSloganWidth) {
										textGSloganWidthDiff = (isEqualCaseTextWidth / isEqualCaseSloganWidth);
									} else {
										sloganGTextWidthDiff = (isEqualCaseSloganWidth / isEqualCaseTextWidth);
									}

									if (logoObj.templatePath.isDBLineCompanyText == "yes") {
										obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text1', sloganGTextWidthDiff);
										logoObj.templatePath.updates.text1.x = obj.x;
										logoObj.templatePath.updates.text1.y = obj.y;
										logoObj.templatePath.updates.text1.scale = obj.scale;

										obj = updateGroupSize($('#templateGenerator  .svgLogoName_2'), logoObj.templatePath, 'text2', sloganGTextWidthDiff);
										logoObj.templatePath.updates.text2.x = obj.x;
										logoObj.templatePath.updates.text2.y = obj.y;
										logoObj.templatePath.updates.text2.scale = obj.scale;
									} else {
										obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text', sloganGTextWidthDiff);
										logoObj.templatePath.updates.text.x = obj.x;
										logoObj.templatePath.updates.text.y = obj.y;
										logoObj.templatePath.updates.text.scale = obj.scale;
									}

									obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', textGSloganWidthDiff);
									logoObj.templatePath.updates.slogan.x = obj.x;
									logoObj.templatePath.updates.slogan.y = obj.y;
									logoObj.templatePath.updates.slogan.scale = obj.scale;
									if (logoObj.templatePath.isFrame == 1) {
									} else {
										obj = updateGroupSize($('#templateGenerator  .logoContainerBox'), logoObj.templatePath, 'logoContainer', 0);
										logoObj.templatePath.updates.logoContainer.x = obj.x;
										logoObj.templatePath.updates.logoContainer.y = obj.y;
										logoObj.templatePath.updates.logoContainer.scale = obj.scale;
									}
								} else {
									if (logoObj.templatePath.isDBLineCompanyText == "yes") {
										obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text1', 0);
										logoObj.templatePath.updates.text1.x = obj.x;
										logoObj.templatePath.updates.text1.y = obj.y;
										logoObj.templatePath.updates.text1.scale = obj.scale;

										obj = updateGroupSize($('#templateGenerator  .svgLogoName_2'), logoObj.templatePath, 'text2', 0);
										logoObj.templatePath.updates.text2.x = obj.x;
										logoObj.templatePath.updates.text2.y = obj.y;
										logoObj.templatePath.updates.text2.scale = obj.scale;

									} else {
										obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text', 0);
										logoObj.templatePath.updates.text.x = obj.x;
										logoObj.templatePath.updates.text.y = obj.y;
										logoObj.templatePath.updates.text.scale = obj.scale;
									}

									obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', 0);
									logoObj.templatePath.updates.slogan.x = obj.x;
									logoObj.templatePath.updates.slogan.y = obj.y;
									logoObj.templatePath.updates.slogan.scale = obj.scale;
									if (logoObj.templatePath.isFrame == 1) {
									} else {
										obj = updateGroupSize($('#templateGenerator  .logoContainerBox'), logoObj.templatePath, 'logoContainer', 0);
										logoObj.templatePath.updates.logoContainer.x = obj.x;
										logoObj.templatePath.updates.logoContainer.y = obj.y;
										logoObj.templatePath.updates.logoContainer.scale = obj.scale;
									}
								}
							} else {

								if (logoObj.templatePath.isDBLineCompanyText == "yes") {
									obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text1', 0);
									logoObj.templatePath.updates.text1.x = obj.x;
									logoObj.templatePath.updates.text1.y = obj.y;
									logoObj.templatePath.updates.text1.scale = obj.scale;

									obj = updateGroupSize($('#templateGenerator  .svgLogoName_2'), logoObj.templatePath, 'text2', 0);
									logoObj.templatePath.updates.text2.x = obj.x;
									logoObj.templatePath.updates.text2.y = obj.y;
									logoObj.templatePath.updates.text2.scale = obj.scale;

								} else {
									obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text', 0);
									logoObj.templatePath.updates.text.x = obj.x;
									logoObj.templatePath.updates.text.y = obj.y;
									logoObj.templatePath.updates.text.scale = obj.scale;
								}

								obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', 0);
								logoObj.templatePath.updates.slogan.x = obj.x;
								logoObj.templatePath.updates.slogan.y = obj.y;
								logoObj.templatePath.updates.slogan.scale = obj.scale;
								if (logoObj.templatePath.isFrame == 1) {
								} else {
									obj = updateGroupSize($('#templateGenerator  .logoContainerBox'), logoObj.templatePath, 'logoContainer', 0);
									logoObj.templatePath.updates.logoContainer.x = obj.x;
									logoObj.templatePath.updates.logoContainer.y = obj.y;
									logoObj.templatePath.updates.logoContainer.scale = obj.scale;
								}
							}
							if (logoObj.templatePath.isFrame == 1) {
								obj = updateGroupSize($('#templateGenerator  .containerBody'), logoObj.templatePath, 'containerBody', 0);
								logoObj.templatePath.updates.containerBody.x = obj.x;
								logoObj.templatePath.updates.containerBody.y = obj.y;
								logoObj.templatePath.updates.containerBody.scale = obj.scale;
							} else {

								obj = updateGroupSize($('#templateGenerator  .logoContainerBox'), logoObj.templatePath, 'logoContainer', 0);
								logoObj.templatePath.updates.logoContainer.x = obj.x;
								logoObj.templatePath.updates.logoContainer.y = obj.y;
								logoObj.templatePath.updates.logoContainer.scale = obj.scale;
							}
							//-----------
							// obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', logoObj.templatePath.updates.slogan.scale);
							break;
						case "sloganLetterSpacing":
						case "sloganTextSize":
						case "sloganNameChange":

							obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', logoObj.templatePath.updates.slogan.scale);
							logoObj.templatePath.updates.slogan.x = obj.x;
							logoObj.templatePath.updates.slogan.y = obj.y;
							logoObj.templatePath.updates.slogan.scale = obj.scale;


							break;
						default:
							obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', 0);
							logoObj.templatePath.updates.slogan.x = obj.x;
							logoObj.templatePath.updates.slogan.y = obj.y;
							logoObj.templatePath.updates.slogan.scale = obj.scale;

							// obj = updateGroupSize($('#templateGenerator  .containerBody'), logoObj.templatePath, 'containerBody', 0);
							// logoObj.templatePath.updates.containerBody.x = obj.x;
							// logoObj.templatePath.updates.containerBody.y = obj.y;
							// logoObj.templatePath.updates.containerBody.scale = obj.scale;
							break;
					}
				} else {
					if (p_sActionType == "sloganNameFont") {

						if (logoObj.templatePath.isDBLineCompanyText == "yes") {
							obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text1', 0);
							logoObj.templatePath.updates.text1.x = obj.x;
							logoObj.templatePath.updates.text1.y = obj.y;
							logoObj.templatePath.updates.text1.scale = obj.scale;

							obj = updateGroupSize($('#templateGenerator  .svgLogoName_2'), logoObj.templatePath, 'text2', 0);
							logoObj.templatePath.updates.text2.x = obj.x;
							logoObj.templatePath.updates.text2.y = obj.y;
							logoObj.templatePath.updates.text2.scale = obj.scale;
						} else {
							obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text', 0);
							logoObj.templatePath.updates.text.x = obj.x;
							logoObj.templatePath.updates.text.y = obj.y;
							logoObj.templatePath.updates.text.scale = obj.scale;
						}

					}
					obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', 0);
					logoObj.templatePath.updates.slogan.x = obj.x;
					logoObj.templatePath.updates.slogan.y = obj.y;
					logoObj.templatePath.updates.slogan.scale = obj.scale;

					if (p_sActionType == "sloganNameFont") {
						if (logoObj.templatePath.isFrame == 1) {
						} else {
							obj = updateGroupSize($('#templateGenerator  .logoContainerBox'), logoObj.templatePath, 'logoContainer', 0);
							logoObj.templatePath.updates.logoContainer.x = obj.x;
							logoObj.templatePath.updates.logoContainer.y = obj.y;
							logoObj.templatePath.updates.logoContainer.scale = obj.scale;
						}
					}
				}
			}

			if ((logoObj.templatePath.isIcon == 1 || logoObj.templatePath.isMono == 1) && $for == "icon") {
				if (logoObj.templatePath.sloganSetAsPerText == 1) {
					var textGSloganWidthDiff = 1;
					var sloganGTextWidthDiff = 1;
					if (logoMakerFunction.checkTemplateIsEqualCondition(logoObj)) {
						var isEqualCaseTextWidth;

						if (logoObj.templatePath.isDBLineCompanyText == "yes") {
							isEqualCaseTextWidth = Math.max(parseInt($('#templateGenerator  .svgLogoName_1').get(0).getBBox().width), parseInt($('#templateGenerator  .svgLogoName_2').get(0).getBBox().width));
						} else {
							isEqualCaseTextWidth = parseInt($('#templateGenerator  .svgLogoName_1').get(0).getBBox().width);
						}
						var isEqualCaseSloganWidth = parseInt($('#templateGenerator  .svgSloganText_1').get(0).getBBox().width);
						debugConsole("isEqualCaseTextWidth:=" + isEqualCaseTextWidth);
						debugConsole("isEqualCaseSloganWidth:=" + isEqualCaseSloganWidth);
						if (isEqualCaseTextWidth > isEqualCaseSloganWidth) {
							textGSloganWidthDiff = (isEqualCaseTextWidth / isEqualCaseSloganWidth);
						} else {
							sloganGTextWidthDiff = (isEqualCaseSloganWidth / isEqualCaseTextWidth);
						}

						if (logoObj.templatePath.isDBLineCompanyText == "yes") {
							obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text1', sloganGTextWidthDiff);
							logoObj.templatePath.updates.text1.x = obj.x;
							logoObj.templatePath.updates.text1.y = obj.y;
							logoObj.templatePath.updates.text1.scale = obj.scale;

							obj = updateGroupSize($('#templateGenerator  .svgLogoName_2'), logoObj.templatePath, 'text2', sloganGTextWidthDiff);
							logoObj.templatePath.updates.text2.x = obj.x;
							logoObj.templatePath.updates.text2.y = obj.y;
							logoObj.templatePath.updates.text2.scale = obj.scale;
						} else {
							obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text', sloganGTextWidthDiff);
							logoObj.templatePath.updates.text.x = obj.x;
							logoObj.templatePath.updates.text.y = obj.y;
							logoObj.templatePath.updates.text.scale = obj.scale;
						}


						obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', textGSloganWidthDiff);
						logoObj.templatePath.updates.slogan.x = obj.x;
						logoObj.templatePath.updates.slogan.y = obj.y;
						logoObj.templatePath.updates.slogan.scale = obj.scale;
					}
				} else {

					if (logoObj.templatePath.isDBLineCompanyText == "yes") {
						obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text1', 0);
						logoObj.templatePath.updates.text1.x = obj.x;
						logoObj.templatePath.updates.text1.y = obj.y;
						logoObj.templatePath.updates.text1.scale = obj.scale;

						obj = updateGroupSize($('#templateGenerator  .svgLogoName_2'), logoObj.templatePath, 'text2', 0);
						logoObj.templatePath.updates.text2.x = obj.x;
						logoObj.templatePath.updates.text2.y = obj.y;
						logoObj.templatePath.updates.text2.scale = obj.scale;
					} else {
						obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text', 0);
						logoObj.templatePath.updates.text.x = obj.x;
						logoObj.templatePath.updates.text.y = obj.y;
						logoObj.templatePath.updates.text.scale = obj.scale;
					}

					obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', 0);
					logoObj.templatePath.updates.slogan.x = obj.x;
					logoObj.templatePath.updates.slogan.y = obj.y;
					logoObj.templatePath.updates.slogan.scale = obj.scale;
				}

				//
				if ((logoObj.templatePath.tempType == "right" || logoObj.templatePath.tempType == "left") && ((p_sActionType == "changeSymbol") || (p_sActionType == "changemongram"))) {
					logoObj.templatePath.lastSymbolXDistance = undefined
				}
				if ((logoObj.templatePath.tempType == "center") && ((p_sActionType == "changeSymbol") || (p_sActionType == "changemongram"))) {
					logoObj.templatePath.lastSymbolYDistance = undefined
				}
				obj = updateGroupSize($('#templateGenerator  .sampleTexts_1'), logoObj.templatePath, 'textAndSlogan', 0);
				logoObj.templatePath.updates.textAndSlogan.x = obj.x;
				logoObj.templatePath.updates.textAndSlogan.y = obj.y;
				logoObj.templatePath.updates.textAndSlogan.scale = obj.scale;
				debugConsole("logoObj.templatePath.updates.textAndSlogan.y:=" + logoObj.templatePath.updates.textAndSlogan.y);


				if (logoObj.templatePath.isIconFrame == 1) {
					obj = updateGroupSize($('#templateGenerator  .sampleIcons_1'), logoObj.templatePath, 'icon', 0);
					logoObj.templatePath.updates.icon.x = obj.x;
					logoObj.templatePath.updates.icon.y = obj.y;
					logoObj.templatePath.updates.icon.scale = obj.scale;
					debugConsole("obj.scale:=" + obj.scale);
				} else {
					if (p_sActionType == "changeSymbol") {
						obj = updateCurrentIconSize($('#templateGenerator  .sampleIcons_1'), logoObj.templatePath, constantVars.ORIGINAL_SPACING.logoSizeSlider, 'icon');
					}
					else if (p_sActionType == "changemongram") {
						obj = updateCurrentIconSize($('#templateGenerator  .sampleIcons_1'), logoObj.templatePath, constantVars.ORIGINAL_SPACING.logoSizeSlider, 'icon');
					}
					else {
						obj = updateCurrentIconSize($('#templateGenerator  .sampleIcons_1'), logoObj.templatePath, constantVars.SPACING.logoSizeSlider, 'icon');
					}


					logoObj.templatePath.updates.icon.x = obj.x;
					logoObj.templatePath.updates.icon.y = obj.y;
					logoObj.templatePath.updates.icon.scale = obj.scale;
				}

				if (logoObj.templatePath.isIconFrame == 1) {
					// obj = updateGroupSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, 'iconFrameBox', constantVars.SPACING.logoSizeSlider);
					// logoObj.templatePath.updates.iconFrameBox.x = obj.x;
					// logoObj.templatePath.updates.iconFrameBox.y = obj.y;
					// logoObj.templatePath.updates.iconFrameBox.scale = obj.scale;
					if (p_sActionType == "changeSymbol") {
						obj = updateCurrentIconSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, constantVars.ORIGINAL_SPACING.logoSizeSlider, 'iconFrameBox');
					}
					else if (p_sActionType == "changemongram") {
						obj = updateCurrentIconSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, constantVars.ORIGINAL_SPACING.logoSizeSlider, 'iconFrameBox');
					}
					else {
						obj = updateCurrentIconSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, constantVars.SPACING.logoSizeSlider, 'iconFrameBox');
					}

					logoObj.templatePath.updates.iconFrameBox.x = obj.x;
					logoObj.templatePath.updates.iconFrameBox.y = obj.y;
					logoObj.templatePath.updates.iconFrameBox.scale = obj.scale;
				} else {
					obj = updateGroupSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, 'iconFrameBox', 0);
					logoObj.templatePath.updates.iconFrameBox.x = obj.x;
					logoObj.templatePath.updates.iconFrameBox.y = obj.y;
					debugConsole("logoObj.templatePath.updates.iconFrameBox.y:=" + logoObj.templatePath.updates.iconFrameBox.y);
					logoObj.templatePath.updates.iconFrameBox.scale = obj.scale;
				}

				if ((p_sActionType == "changeSymbol" || p_sActionType == "changemongram") && (constantVars.SPACING.logoSizeSlider != constantVars.ORIGINAL_SPACING.logoSizeSlider)) {
					obj = updateGroupSize($('#templateGenerator  .containerBody'), logoObj.templatePath, 'containerBody', 0);
					debugConsole("obj.scale:=" + obj.scale);
				} else {
					if (p_oCurrContainerBodyObj) {
						obj = updateGroupSizeByLastValue($('#templateGenerator  .containerBody'), p_oCurrContainerBodyObj)
						debugConsole("p_oCurrContainerBodyObj.scale:=" + p_oCurrContainerBodyObj.scale);
					} else {
						obj = updateGroupSize($('#templateGenerator  .containerBody'), logoObj.templatePath, 'containerBody', 0);
						debugConsole("obj.scale:=" + obj.scale);
					}
				}


				logoObj.templatePath.updates.containerBody.x = obj.x;
				logoObj.templatePath.updates.containerBody.y = obj.y;
				logoObj.templatePath.updates.containerBody.scale = obj.scale;

				if (p_oCurrLogoContainerObj) {
					obj = updateGroupSizeByLastValue($('#templateGenerator  .logoContainerBox'), p_oCurrLogoContainerObj)
					debugConsole("p_oCurrLogoContainerObj.scale:=" + p_oCurrLogoContainerObj.scale);
				} else {
					obj = updateGroupSize($('#templateGenerator  .logoContainerBox'), logoObj.templatePath, 'logoContainer', 0);
				}
				logoObj.templatePath.updates.logoContainer.x = obj.x;
				logoObj.templatePath.updates.logoContainer.y = obj.y;
				logoObj.templatePath.updates.logoContainer.scale = obj.scale;
			}

			if ($for == "containerBody") {
				obj = updateGroupSize($('#templateGenerator  .containerBody'), logoObj.templatePath, 'containerBody', 0);
				logoObj.templatePath.updates.containerBody.x = obj.x;
				logoObj.templatePath.updates.containerBody.y = obj.y;
				logoObj.templatePath.updates.containerBody.scale = obj.scale;
			}

			debugConsole("logoObj.templatePath.tempType:=" + logoObj.templatePath.tempType);
			if (logoObj.templatePath.tempType == 'left' || logoObj.templatePath.tempType == 'right' || $.trim(logoObj.iconPath) == "") {
				if (logoObj.templatePath.isFrame == 1 && $for == "frame") {

					if (p_sActionType == "addOuterContainer") {

					} else {
						obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', 0);
						logoObj.templatePath.updates.slogan.x = obj.x;
						logoObj.templatePath.updates.slogan.y = obj.y;
						logoObj.templatePath.updates.slogan.scale = obj.scale;


						obj = updateGroupSize($('#templateGenerator  .sampleTexts_1'), logoObj.templatePath, 'textAndSlogan', 0);
						logoObj.templatePath.updates.textAndSlogan.x = obj.x;
						logoObj.templatePath.updates.textAndSlogan.y = obj.y;
						logoObj.templatePath.updates.textAndSlogan.scale = obj.scale;


						obj = updateGroupSize($('#templateGenerator  .container_1'), logoObj.templatePath, 'frame', 0);
						logoObj.templatePath.updates.frame.x = obj.x;
						logoObj.templatePath.updates.frame.y = obj.y;
						logoObj.templatePath.updates.frame.scale = obj.scale;

						if (p_oCurrLogoContainerObj) {
							obj = updateGroupSizeByLastValue($('#templateGenerator  .logoContainerBox'), p_oCurrLogoContainerObj)
							debugConsole("p_oCurrLogoContainerObj.scale:=" + p_oCurrLogoContainerObj.scale);
						} else {
							obj = updateGroupSize($('#templateGenerator  .logoContainerBox'), logoObj.templatePath, 'logoContainer', 0);
						}
						logoObj.templatePath.updates.logoContainer.x = obj.x;
						logoObj.templatePath.updates.logoContainer.y = obj.y;
						logoObj.templatePath.updates.logoContainer.scale = obj.scale;
					}

				}
				// if (($for == 'logoName' || $for == 'sloganName') && (logoObj.templatePath.isIcon == 1 || logoObj.templatePath.isMono == 1)) {
				if (($for == 'logoName' || $for == 'logoName1' || $for == 'logoName2' || $for == 'sloganName')) {

					obj = updateGroupSize($('#templateGenerator  .sampleTexts_1'), logoObj.templatePath, 'textAndSlogan', 0);
					logoObj.templatePath.updates.textAndSlogan.x = obj.x;
					logoObj.templatePath.updates.textAndSlogan.y = obj.y;
					logoObj.templatePath.updates.textAndSlogan.scale = obj.scale;
				}

			}
			if (logoObj.templatePath.tempType == 'center') {

				if (p_sActionType == "sloganLetterSpacing" || p_sActionType == "logoLetterSpacing") {

				} else {
					debugConsole("iconDistanceSlider:=" + lEditor.currentLogo.generate.iconDistanceSlider + ",,,," + lEditor.currentLogo.generate.templatePath.isIcon);

					if (lEditor.currentLogo.generate.iconDistanceSlider > constantVars.ORIGINAL_SPACING.iconDistanceSlider && (lEditor.currentLogo.generate.templatePath.isIcon == 1 || lEditor.currentLogo.generate.templatePath.isMono == 1)) {

					} else {
						if (($for == "logoName") && (p_sActionType == "slider")) {

						} else {
							obj = updateGroupSize($('#templateGenerator  .sampleTexts_1'), logoObj.templatePath, 'textAndSlogan', 0);
							logoObj.templatePath.updates.textAndSlogan.x = obj.x;
							logoObj.templatePath.updates.textAndSlogan.y = obj.y;
							logoObj.templatePath.updates.textAndSlogan.scale = obj.scale;
						}
					}
				}

				// if (p_sActionType == "logoNameFont" || p_sActionType == "sloganNameFont") {
				// 	obj = updateGroupSize($('#templateGenerator  .logoContainerBox'), logoObj.templatePath, 'logoContainer', 0);
				// 	logoObj.templatePath.updates.logoContainer.x = obj.x;
				// 	logoObj.templatePath.updates.logoContainer.y = obj.y;
				// 	logoObj.templatePath.updates.logoContainer.scale = obj.scale;
				// }
			}

			if ($for == "iconFrame" || $for == "frame") {
				if (logoObj.templatePath.isIconFrame == 1) {
					// obj = updateGroupSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, 'iconFrameBox', constantVars.SPACING.logoSizeSlider);
					// logoObj.templatePath.updates.iconFrameBox.x = obj.x;
					// logoObj.templatePath.updates.iconFrameBox.y = obj.y;
					// logoObj.templatePath.updates.iconFrameBox.scale = obj.scale;
					if (p_sActionType != "addOuterContainer") {
						if (p_sActionType == "changeIconFrameContainer") {
							obj = updateCurrentIconSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, constantVars.ORIGINAL_SPACING.logoSizeSlider, 'iconFrameBox');
						} else {
							obj = updateCurrentIconSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, constantVars.SPACING.logoSizeSlider, 'iconFrameBox');
						}


						logoObj.templatePath.updates.iconFrameBox.x = obj.x;
						logoObj.templatePath.updates.iconFrameBox.y = obj.y;
						logoObj.templatePath.updates.iconFrameBox.scale = obj.scale;
					}


				}
			}
			// debugConsole("logoObj.templatePath.updates.textAndSlogan.y:=" + logoObj.templatePath.updates.textAndSlogan.y);
			if (($for == "sloganName") && (p_sActionType == "remove_slogan") && ((lEditor.currentLogo.generate.templatePath.isMono == 1) || (lEditor.currentLogo.generate.templatePath.isIcon == 1))) {
				if (logoObj.templatePath.isIconFrame == 1) {
					obj = updateCurrentIconSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, constantVars.SPACING.logoSizeSlider, 'iconFrameBox');
				} else {
					obj = updateGroupSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, 'iconFrameBox', 0);
				}
				logoObj.templatePath.updates.iconFrameBox.x = obj.x;
				logoObj.templatePath.updates.iconFrameBox.y = obj.y;
				logoObj.templatePath.updates.iconFrameBox.scale = obj.scale;
			}

			if ((($for == "logoName") || ($for == "logoName1") || ($for == "logoName2")) && (lEditor.currentLogo.generate.templatePath.isMono == 1) && (p_sActionType == "logoTextEdit" || p_sActionType == "logoText1Edit" || p_sActionType == "logoText2Edit" || p_sActionType == "undo_redo_logoName" || p_sActionType == "undo_redo_logoName1" || p_sActionType == "undo_redo_logoName2")) {
				if (lEditor.currentLogo.generate.templatePath.isIconFrame == 1) {
					obj = updateGroupSize($('#templateGenerator  .sampleIcons_1'), logoObj.templatePath, 'icon', 0);
					logoObj.templatePath.updates.icon.x = obj.x;
					logoObj.templatePath.updates.icon.y = obj.y;
					logoObj.templatePath.updates.icon.scale = obj.scale;

					obj = updateCurrentIconSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, constantVars.SPACING.logoSizeSlider, 'iconFrameBox');

					logoObj.templatePath.updates.iconFrameBox.x = obj.x;
					logoObj.templatePath.updates.iconFrameBox.y = obj.y;
					logoObj.templatePath.updates.iconFrameBox.scale = obj.scale;
				} else {
					obj = updateGroupSize($('#templateGenerator  .sampleIcons_1'), logoObj.templatePath, 'icon', 0);
					logoObj.templatePath.updates.icon.x = obj.x;
					logoObj.templatePath.updates.icon.y = obj.y;
					logoObj.templatePath.updates.icon.scale = obj.scale;

					obj = updateGroupSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, 'iconFrameBox', 0);
					logoObj.templatePath.updates.iconFrameBox.x = obj.x;
					logoObj.templatePath.updates.iconFrameBox.y = obj.y;
					logoObj.templatePath.updates.iconFrameBox.scale = obj.scale;
				}
			}


			debugConsole("$for:=" + $for + ",,,,,current targetlink:=" + lEditor.getSession('targetlink'));
			var currentTab = parseInt(lEditor.getSession('targetlink'));
			switch ($for) {
				case "logoName":
					if (currentTab === 8) {
						logoObj.logoTextSlider = constantVars.ORIGINAL_SPACING.logoTextSlider;
						logoObj.logoLetterSpacing = constantVars.ORIGINAL_SPACING.logoLetterSpacing;
						debugConsole("reset logoName slider bar setting");
					}
					break;

				case "sloganName":
					if (currentTab === 10) {
						logoObj.sloganLetterSpacing = constantVars.ORIGINAL_SPACING.sloganLetterSpacing;
						logoObj.sloganTextSize = constantVars.ORIGINAL_SPACING.sloganTextSize;
						logoObj.textSloganDistSlider = constantVars.ORIGINAL_SPACING.textSloganDistSlider;
						debugConsole("reset sloganName slider bar setting");
					}
					break;
				case "icon":
				case "containerBody":
					if (currentTab === 39 || currentTab === 32) {
						logoObj.logoSizeSlider = constantVars.ORIGINAL_SPACING.logoSizeSlider;
						logoObj.iconDistanceSlider = constantVars.ORIGINAL_SPACING.iconDistanceSlider;
						debugConsole("reset icon or monogram slider bar setting");
					}
					break;

				case "frame":
					if (currentTab === 42) {
						logoObj.frameSizeSlider = constantVars.ORIGINAL_SPACING.frameSizeSlider;
						debugConsole("reset frame slider bar setting");
					}
					break;
			}

			// debugConsole("json logoObj:="+getValidJsonStringifyObj(logoObj));

			template = $("#templateGenerator").html();
			$("#templateGenerator").html('');
			return { 'logoObj': logoObj, 'html': template };
		},
		/**
		 * 
		 */
		checkSpecialCondition: function () {
			var sloganName = lEditor.getSession('sloganText');
			var logoName = lEditor.getSession('logoname');
			if (logoName.length > 20 || sloganName.length > 25) {
				return true;
			}
			return false;
		},
		/**
		 * 
		 * @param {*} templatePath 
		 */
		checkTemplateIsEqualCondition: function (p_oGenerate) {
			var sloganName = lEditor.getSession('sloganText');
			var logoText = lEditor.getSession('logoname');
			var logoTextList = lEditor.getLogoTextList(p_oGenerate.splitLogoName);
			var logoNameLength;
			if (p_oGenerate.templatePath.isDBLineCompanyText == "yes" && logoTextList.length > 0 && logoTextList.length == 2) {
				logoNameLength = Math.max(logoTextList[0].length, logoTextList[1].length);
				if (p_oGenerate.templatePath.isEqual == 1 && sloganName && (sloganName != "") && (sloganName.length >= 9) && (logoNameLength >= (sloganName.length)) && (logoNameLength <= 35)) {
					return true;
				}
			} else {
				logoNameLength = logoText.length;
				debugConsole("logoNameLength:=" + logoNameLength);
				debugConsole("sloganName.length:=" + sloganName.length);
				if (p_oGenerate.templatePath.isEqual == 1 && sloganName && (sloganName != "") && (sloganName.length >= 9) && (logoNameLength >= sloganName.length) && (logoNameLength <= 35)) {
					return true;
				}
			}
			return false;
		},
		/**
		 * 
		 */
		getDynamicSvgTag: function () {
			if (svgTagNameSpace == "") {
				// debugConsole("iconNameSpaceList length:=" + lEditor.iconNameSpaceList.length);
				if (lEditor.iconNameSpaceList && lEditor.iconNameSpaceList.length > 0) {
					svgTagNameSpace = '<svg version="1.1" dynamicNameSpace xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" height="100%" width="100%" x="0px" y="0px" viewBox="0 0 ' + constantVars.VIEWBOXWIDTH + ' ' + constantVars.VIEWBOXHEIGHT + '" xml:space="preserve" preserveAspectRatio="xMidYMid meet" class="">{{textGradient}}{{text2Gradient}}{{sloganGradient}}{{iconGradient}}{{frameGradient}}{{iconFrameGradient}}';

					var nameSpaceStr = "";
					lEditor.iconNameSpaceList.forEach(function (item, index) {
						debugConsole(item + ",," + index);
						item = item.replace('^', '="');
						debugConsole(item);
						if (index == 0) {
							nameSpaceStr += item + '"';
						} else {
							nameSpaceStr += ' ' + item + '"';
						}
					});
					svgTagNameSpace = svgTagNameSpace.replace("dynamicNameSpace", nameSpaceStr);
				}
			}
			return svgTagNameSpace;
		},
		/**
		 * generate new logo templage in single manner
		 * @param {*} logoObj 
		 * @param {*} idKey 
		 * @param {*} p_nLogoTextSlider 
		 * @param {*} p_nLogoLetterSpacing 
		 */
		generateLogoTemplate: function (logoObj, idKey, p_nLogoTextSlider = null, p_nLogoLetterSpacing = null, p_oCurrContainerBodyObj, isSetSlogan = true, p_sActionName) {
			debugConsole("generateLogoTemplate p_nLogoTextSlider:=" + p_nLogoTextSlider + ",,,,,p_nLogoLetterSpacing:=" + p_nLogoLetterSpacing + ",,,isSetSlogan:=" + isSetSlogan + ",,,p_sActionName:=" + p_sActionName);
			debugConsole("logoObj.templatePath.isDBLineCompanyText:=" + logoObj.templatePath.isDBLineCompanyText);
			if (typeof idKey === "undefined") {
				idKey = "";
			}

			if (typeof logoObj.templatePath.iconFrameBox === 'undefined') {
				logoObj.templatePath.iconFrameBox = {};
				logoObj.templatePath.iconFrameBox.x = 0;
				logoObj.templatePath.iconFrameBox.y = 0;
				logoObj.templatePath.iconFrameBoxScale = 1;
				logoObj.templatePath.updates.iconFrameBox = {};
				logoObj.templatePath.updates.iconFrameBox.x = 0;
				logoObj.templatePath.updates.iconFrameBox.y = 0;
				logoObj.templatePath.updates.iconFrameBox.scale = 1;
			}
			var result = {};
			var obj = {};
			var getSVGTag = logoMakerFunction.getDynamicSvgTag();
			// debugConsole("getSVGTag:="+getSVGTag);
			var template = null;
			if (getSVGTag != "") {
				template = getSVGTag;
			} else {
				template = '<svg version="1.1" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" height="100%" width="100%" x="0px" y="0px" viewBox="0 0 ' + constantVars.VIEWBOXWIDTH + ' ' + constantVars.VIEWBOXHEIGHT + '" xml:space="preserve" preserveAspectRatio="xMidYMid meet" class="">{{textGradient}}{{text2Gradient}}{{sloganGradient}}{{iconGradient}}{{frameGradient}}{{iconFrameGradient}}';
			}

			template += '<rect x="0px" y="0px" width="100%" height="100%" fill="{{svgColor}}"/>';
			// template += '<g class="logo-container-box logoContainerBox" height="300" width="300">';
			template += '<g class="logo-container-box logoContainerBox">';
			if (logoObj.templatePath.isFrame == 1) {
				template += '<g class="container_1" transform="scale(1)" fill="{{frameFill}}">{{frameHtml}}</g>';
			}
			template += '<g class="containerBody">';
			if (logoObj.templatePath.isIcon == 1 || logoObj.templatePath.isMono == 1) {
				template += '<g class="sampleIconBox" transform="scale({{iconFrameBoxScale}}) translate({{iconFrameBoxX}},{{iconFrameBoxY}})">';
				if (logoObj.templatePath.isIconFrame == 1) {
					template += '<g class="iconFrame" transform="scale({{iconFrameScale}}) translate({{iconFrameX}},{{iconFrameY}})"  fill="{{iconFrameFill}}">{{iconFrameHtml}}</g>';
				}
				template += '<g class="sampleIcons_1" transform="scale({{iconScale}}) translate({{iconX}},{{iconY}})" fill="{{iconFill}}">{{iconHtml}}</g>';
				template += '</g>';
			}
			template += '<g class="sampleTexts_1">';

			if (logoObj.templatePath.isDBLineCompanyText == "yes") {
				template += '<g class="logo--name svgLogoName_1 logoNameBox1" transform="scale(1)" fill="{{text1Fill}}">{{text1Html}}</g>';

				template += '<g class="logo--name svgLogoName_2 logoNameBox2" transform="scale(1)" fill="{{text2Fill}}">{{text2Html}}</g>';
			} else {
				template += '<g class="logo--name svgLogoName_1 logoNameBox" transform="scale(1)" fill="{{textFill}}">{{textHtml}}</g>';
			}

			template += '<g id="" class="logo--name svgSloganText_1 sloganBox" transform="scale(1)" fill="{{sloganFill}}">{{sloganHtml}}</g>';
			template += '</g>';
			template += '</g>';
			template += '</g>';
			template += '</svg>';


			if (logoObj.textGradient != "") {
				logoObj.mainTextColor = 'url(#textGradient' + idKey + ')';
			}
			if ((logoObj.templatePath.isDBLineCompanyText == "yes") && logoObj.text2Gradient != "") {
				logoObj.mainText2Color = 'url(#text2Gradient' + idKey + ')';

			}
			if (logoObj.sloganGradient != "") {
				logoObj.sloganTextColor = 'url(#sloganGradient' + idKey + ')';
			}
			if (logoObj.frameGradient != "" && logoObj.templatePath.frameType == "outline") {
				logoObj.frameColor = 'url(#frameGradient' + idKey + ')';
			}
			if (logoObj.frameFilledGradient != "" && logoObj.templatePath.frameType == "filled") {
				logoObj.frameFilledColor = 'url(#frameGradient' + idKey + ')';
			}
			if (logoObj.iconFrameGradient != "") {
				logoObj.iconFrameColor = 'url(#iconFrameGradient' + idKey + ')';
			}
			if (logoObj.iconGradient != "") {
				logoObj.iconColor = 'url(#iconGradient' + idKey + ')';
			}

			template = this.applyGradientToTemplate(template, logoObj, idKey);

			template = template.replace("{{svgColor}}", logoObj.bgColor);
			if (logoObj.templatePath.isDBLineCompanyText == "yes") {
				template = template.replace("{{text1Html}}", logoObj.logoPath1);
				template = template.replace("{{text2Html}}", logoObj.logoPath2);

				template = template.replace("{{text1Fill}}", logoObj.mainTextColor);
				template = template.replace("{{text2Fill}}", logoObj.mainText2Color);
			} else {
				template = template.replace("{{textHtml}}", logoObj.logoPath);
				template = template.replace("{{textFill}}", logoObj.mainTextColor);
			}

			// template = template.replace("{{textScale}}", logoObj.templatePath.textScale);
			// template = template.replace("{{textX}}", logoObj.templatePath.textX);
			// template = template.replace("{{textY}}", logoObj.templatePath.textY);


			template = template.replace("{{sloganHtml}}", logoObj.sloganPath);

			// template = template.replace("{{sloganScale}}", logoObj.templatePath.sloganScale);
			// template = template.replace("{{sloganX}}", logoObj.templatePath.sloganX);
			// template = template.replace("{{sloganY}}", logoObj.templatePath.sloganY);

			template = template.replace("{{sloganFill}}", logoObj.sloganTextColor);

			template = template.replace("{{frameHtml}}", logoObj.framePath);

			// template = template.replace("{{frameScale}}", logoObj.templatePath.frameScale);
			// template = template.replace("{{frameX}}", logoObj.templatePath.frameX);
			// template = template.replace("{{frameY}}", logoObj.templatePath.frameY);


			if (logoObj.templatePath.frameType == "filled") {
				// debugConsole("logoObj.frameFilledColor:=" + logoObj.frameFilledColor);
				template = template.replace("{{frameFill}}", logoObj.frameFilledColor);
			} else {
				// debugConsole("logoObj.frameColor:=" + logoObj.frameColor);
				if (p_sActionName == "layoutVariations") {
					if (logoObj.bgColor == "#000000" || logoObj.bgColor == "#000" || logoObj.bgColor == "black") {
						if (removeMultipleSpaces(logoObj.frameColor) == "" || logoObj.frameColor == logoObj.bgColor) {
							logoObj.frameColor = "#ffffff";
						}
					}
				}
				template = template.replace("{{frameFill}}", logoObj.frameColor);
			}

			if (logoObj.templatePath.isIcon == 1 || logoObj.templatePath.isMono == 1) {
				template = template.replace("{{iconHtml}}", logoObj.iconPath);
				template = template.replace("{{iconScale}}", logoObj.templatePath.iconScale ? logoObj.templatePath.iconScale : 1);

				template = template.replace("{{iconX}}", logoObj.templatePath.iconX ? logoObj.templatePath.iconX : 0);
				template = template.replace("{{iconY}}", logoObj.templatePath.iconY ? logoObj.templatePath.iconY : 0);


				if (p_sActionName == "layoutVariations" || p_sActionName == "monogramVariations") {
					if (logoObj.bgColor == "#000000" || logoObj.bgColor == "#000" || logoObj.bgColor == "black") {
						if (removeMultipleSpaces(logoObj.iconColor) == "" || logoObj.iconColor == logoObj.bgColor) {
							logoObj.iconColor = "#ffffff";
						}
					}
				}

				template = template.replace("{{iconFill}}", logoObj.iconColor);

				template = template.replace("{{iconFrameFill}}", logoObj.iconFrameColor);
				template = template.replace("{{iconFrameBoxX}}", logoObj.templatePath.iconFrameBox.x);
				template = template.replace("{{iconFrameBoxY}}", logoObj.templatePath.iconFrameBox.y);
				if (logoObj.templatePath.isIconFrame == 1) {
					if (logoObj.templatePath.iconFrameBox.scale) {
						template = template.replace("{{iconFrameBoxScale}}", logoObj.templatePath.iconFrameBox.scale);
					} else {
						template = template.replace("{{iconFrameBoxScale}}", logoObj.templatePath.iconFrameBoxScale);
					}

				} else {
					template = template.replace("{{iconFrameBoxScale}}", logoObj.templatePath.iconFrameBoxScale);
				}

			}
			if (logoObj.templatePath.isIconFrame == 1) {
				template = template.replace("{{iconFrameHtml}}", logoObj.iconFramePath);
				template = template.replace("{{iconFrameFill}}", logoObj.iconFrameColor);
				template = template.replace("{{iconFrameY}}", logoObj.templatePath.iconFrame.x);
				template = template.replace("{{iconFrameX}}", logoObj.templatePath.iconFrame.y);
				template = template.replace("{{iconFrameScale}}", logoObj.templatePath.iconFrame.scale ? logoObj.templatePath.iconFrame.scale : 1);

			}

			$("#templateGenerator").html(template);

			var sloganObj;
			if (isSetSlogan) {
				if (typeof logoObj.sloganFontObject !== 'undefined' && typeof logoObj.sloganFontObject !== 'string') {
					sloganObj = logoObj.sloganFontObject;
				} else {
					sloganObj = currSloganFontObject;
				}
			}

			var slogan = null;
			var isSloganLSAlreadySet = false;
			if (isSetSlogan) {
				debugConsole("logoObj.templatePath.sloganSetAsPerText:=" + logoObj.templatePath.sloganSetAsPerText);
				var isEqualCaseSloganLetterSpacing = constantVars.ORIGINAL_SPACING.sloganLetterSpacing;
				var sloganText = lEditor.getSession('sloganText');
				var sloganNameLength = sloganText.length;
				var logoNameLength = 0;

				var IsEqualCondition = false;
				var logoText = lEditor.getSession('logoname');
				var logoTextList = lEditor.getLogoTextList(logoObj.splitLogoName);

				debugConsole("logoObj.templatePath.isDBLineCompanyText:=" + logoObj.templatePath.isDBLineCompanyText + ",,," + logoObj.templatePath.template_db_id);

				if (logoObj.templatePath.isDBLineCompanyText == "yes" && logoTextList.length > 0 && logoTextList.length == 2) {
					logoNameLength = Math.max(logoTextList[0].length, logoTextList[1].length);
					if (logoObj.templatePath.isEqual == 1 && sloganText && (sloganText != "") && (sloganNameLength >= 9) && (logoNameLength >= (sloganNameLength)) && (logoNameLength <= 35 && logoObj.templatePath.sloganSetAsPerText == 1)) {
						IsEqualCondition = true;
					}
				} else {

					logoNameLength = logoText.length;
					if (logoObj.templatePath.isEqual == 1 && sloganText && (sloganText != "") && (sloganNameLength >= 9) && (logoNameLength >= sloganNameLength) && (logoNameLength <= 35 && logoObj.templatePath.sloganSetAsPerText == 1)) {
						IsEqualCondition = true;
					}
				}

				debugConsole("logoNameLength:=" + logoNameLength);
				debugConsole("sloganNameLength:=" + sloganNameLength);
				debugConsole("IsEqualCondition:=" + IsEqualCondition);
				if (IsEqualCondition) {
					if (logoNameLength >= sloganNameLength) {
						if (sloganNameLength >= 20) {
							isEqualCaseSloganLetterSpacing = (sloganNameLength + logoNameLength) / 2;
						} else {
							isEqualCaseSloganLetterSpacing = (sloganNameLength + logoNameLength);
						}
						logoObj.sloganLetterSpacing = isEqualCaseSloganLetterSpacing;
						isSloganLSAlreadySet = true;
						if (p_sActionName == "outerContainerRemove" || p_sActionName == "innerContainerRemove" || p_sActionName == "symbolOrMonoPlacing") {
							logoMakerFunction.setSliderForSloganLetterSpacing(isEqualCaseSloganLetterSpacing);
						}
					} else if (sloganNameLength >= logoNameLength) {
						if (sloganNameLength / 2 < logoNameLength) {
							isEqualCaseSloganLetterSpacing = (sloganNameLength + logoNameLength);
							logoObj.sloganLetterSpacing = isEqualCaseSloganLetterSpacing;
							if (p_sActionName == "outerContainerRemove" || p_sActionName == "innerContainerRemove" || p_sActionName == "symbolOrMonoPlacing") {
								logoMakerFunction.setSliderForSloganLetterSpacing(isEqualCaseSloganLetterSpacing);
							}
							isSloganLSAlreadySet = true;
						}
					}
				}
				debugConsole("slogan letter spacing:=" + isEqualCaseSloganLetterSpacing);

				if (lEditor.getSession('sloganText') && sloganObj) {
					slogan = sloganObj.getPath(lEditor.getSession('sloganText'), 0, 0, constantVars.ORIGINAL_SPACING.sloganTextSize, { 'letterSpacing': parseFloat(isEqualCaseSloganLetterSpacing) });
				}
			}


			if (p_nLogoTextSlider) {
				logoObj.logoTextSlider = p_nLogoTextSlider;
			} else {
				logoObj.logoTextSlider = constantVars.SPACING.logoTextSlider;
			}
			if (p_nLogoLetterSpacing) {
				logoObj.logoLetterSpacing = p_nLogoLetterSpacing;
			} else {
				logoObj.logoLetterSpacing = constantVars.SPACING.logoLetterSpacing;
			}

			if (!isSloganLSAlreadySet) {
				logoObj.sloganLetterSpacing = constantVars.ORIGINAL_SPACING.sloganLetterSpacing;
				if (p_sActionName == "outerContainerRemove" || p_sActionName == "innerContainerRemove") {
					logoMakerFunction.resetSlider("sloganLetterSpacing");
				}
			} else {
				// if(isSloganLSAlreadySet && isSetSlogan){
				// 	logoObj.sloganLetterSpacing = isEqualCaseSloganLetterSpacing;
				// 	logoMakerFunction.setSliderForSloganLetterSpacing(isEqualCaseSloganLetterSpacing);
				// }

			}

			logoObj.sloganTextSize = constantVars.ORIGINAL_SPACING.sloganTextSize;
			logoObj.textSloganDistSlider = constantVars.ORIGINAL_SPACING.textSloganDistSlider;
			if (p_sActionName == "outerContainerRemove" || p_sActionName == "innerContainerRemove") {
				logoMakerFunction.resetSlider("sloganTextSize");
			}


			debugConsole("isIconFrame:=" + logoObj.templatePath.isIconFrame);

			logoObj.logoSizeSlider = constantVars.ORIGINAL_SPACING.logoSizeSlider;
			logoObj.iconDistanceSlider = constantVars.ORIGINAL_SPACING.iconDistanceSlider;

			logoObj.frameSizeSlider = constantVars.ORIGINAL_SPACING.frameSizeSlider;

			if (p_sActionName == "innerContainerRemove") {
				logoMakerFunction.resetSlider("logoSizeSlider");
				logoMakerFunction.resetSlider("iconDistanceSlider");
				logoMakerFunction.resetSlider("frameSizeSlider");
			}
			else if (p_sActionName == "outerContainerRemove") {
				logoMakerFunction.resetSlider("logoSizeSlider");
			}

			if (slogan) {
				logoObj.sloganPath = slogan.toSVG();
				$('#templateGenerator  .svgSloganText_1').html(logoObj.sloganPath);
			}
			// manage spacing
			var textGSloganWidthDiff = 1;
			var sloganGTextWidthDiff = 1;
			if (logoMakerFunction.checkTemplateIsEqualCondition(logoObj) && logoObj.templatePath.sloganSetAsPerText == 1) {
				var isEqualCaseTextWidth = 0;
				if (logoObj.templatePath.isDBLineCompanyText == "yes") {
					isEqualCaseTextWidth = Math.max(parseInt($('#templateGenerator  .svgLogoName_1').get(0).getBBox().width), parseInt($('#templateGenerator  .svgLogoName_2').get(0).getBBox().width))
				} else {
					isEqualCaseTextWidth = parseInt($('#templateGenerator  .svgLogoName_1').get(0).getBBox().width);
				}
				var isEqualCaseSloganWidth = parseInt($('#templateGenerator  .svgSloganText_1').get(0).getBBox().width);
				debugConsole("isEqualCaseTextWidth:=" + isEqualCaseTextWidth);
				debugConsole("isEqualCaseSloganWidth:=" + isEqualCaseSloganWidth);
				if (isEqualCaseTextWidth > isEqualCaseSloganWidth) {
					textGSloganWidthDiff = (isEqualCaseTextWidth / isEqualCaseSloganWidth);
				} else {
					sloganGTextWidthDiff = (isEqualCaseSloganWidth / isEqualCaseTextWidth);
				}
			}

			debugConsole("sloganGTextWidthDiff:=" + sloganGTextWidthDiff);
			debugConsole("textGSloganWidthDiff:=" + textGSloganWidthDiff);


			if (logoObj.templatePath.isDBLineCompanyText == "yes") {

				obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text1', sloganGTextWidthDiff);
				logoObj.templatePath.updates.text1.x = obj.x;
				logoObj.templatePath.updates.text1.y = obj.y;
				logoObj.templatePath.updates.text1.scale = obj.scale;

				obj = updateGroupSize($('#templateGenerator  .svgLogoName_2'), logoObj.templatePath, 'text2', sloganGTextWidthDiff);
				logoObj.templatePath.updates.text2.x = obj.x;
				logoObj.templatePath.updates.text2.y = obj.y;
				logoObj.templatePath.updates.text2.scale = obj.scale;

			} else {
				// debugConsole("logoObj.templatePath:=" + JSON.stringify(logoObj.templatePath));
				obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text', (sloganGTextWidthDiff));
				logoObj.templatePath.updates.text.x = obj.x;
				logoObj.templatePath.updates.text.y = obj.y;
				logoObj.templatePath.updates.text.scale = obj.scale;

			}

			debugConsole("sloganGTextWidthDiff:=" + sloganGTextWidthDiff);
			debugConsole("textGSloganWidthDiff:=" + textGSloganWidthDiff);

			obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', (textGSloganWidthDiff));
			logoObj.templatePath.updates.slogan.x = obj.x;
			logoObj.templatePath.updates.slogan.y = obj.y;
			logoObj.templatePath.updates.slogan.scale = obj.scale;

			obj = updateGroupSize($('#templateGenerator  .sampleTexts_1'), logoObj.templatePath, 'textAndSlogan', 0);
			logoObj.templatePath.updates.textAndSlogan.x = obj.x;
			logoObj.templatePath.updates.textAndSlogan.y = obj.y;
			logoObj.templatePath.updates.textAndSlogan.scale = obj.scale;


			if (logoObj.templatePath.isIconFrame == 1) {
				obj = updateGroupSize($('#templateGenerator  .iconFrame'), logoObj.templatePath, 'iconFrame', 0);
				logoObj.templatePath.updates.iconFrame.x = obj.x;
				logoObj.templatePath.updates.iconFrame.y = obj.y;
				logoObj.templatePath.updates.iconFrame.scale = obj.scale;
			}

			if (logoObj.templatePath.isIcon == 1 || logoObj.templatePath.isMono == 1) {
				if (logoObj.templatePath.isIconFrame == 1) {
					obj = updateGroupSize($('#templateGenerator  .sampleIcons_1'), logoObj.templatePath, 'icon', 0);
					logoObj.templatePath.updates.icon.x = obj.x;
					logoObj.templatePath.updates.icon.y = obj.y;
					logoObj.templatePath.updates.icon.scale = obj.scale;
					debugConsole("obj.scale:=" + obj.scale);

				} else {

					if (p_sActionName == "monogramVariations" || p_sActionName == "layoutVariations" ||
						p_sActionName == "dynamicLogoVariations" || p_sActionName == "addNewSymbol" || p_sActionName == "addInnerContainer") {

						obj = updateCurrentIconSize($('#templateGenerator  .sampleIcons_1'), logoObj.templatePath, constantVars.ORIGINAL_SPACING.logoSizeSlider, 'icon');
					} else {
						obj = updateCurrentIconSize($('#templateGenerator  .sampleIcons_1'), logoObj.templatePath, constantVars.SPACING.logoSizeSlider, 'icon');
					}
					logoObj.templatePath.updates.icon.x = obj.x;
					logoObj.templatePath.updates.icon.y = obj.y;
					logoObj.templatePath.updates.icon.scale = obj.scale;
				}
				if (logoObj.templatePath.isIconFrame == 1) {
					// obj = updateGroupSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, 'iconFrameBox', 0);
					if (p_sActionName == "monogramVariations" || p_sActionName == "layoutVariations" ||
						p_sActionName == "dynamicLogoVariations" || p_sActionName == "addNewSymbol" || p_sActionName == "addInnerContainer") {

						obj = updateCurrentIconSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, constantVars.ORIGINAL_SPACING.logoSizeSlider, 'iconFrameBox');
					} else {
						obj = updateCurrentIconSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, constantVars.SPACING.logoSizeSlider, 'iconFrameBox');
					}
					logoObj.templatePath.updates.iconFrameBox.x = obj.x;
					logoObj.templatePath.updates.iconFrameBox.y = obj.y;
					logoObj.templatePath.updates.iconFrameBox.scale = obj.scale;

				} else {
					obj = updateGroupSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, 'iconFrameBox', 0);
					logoObj.templatePath.updates.iconFrameBox.x = obj.x;
					logoObj.templatePath.updates.iconFrameBox.y = obj.y;
					logoObj.templatePath.updates.iconFrameBox.scale = obj.scale;
				}
			}
			if (logoObj.templatePath.isFrame == 1) {
				obj = updateGroupSize($('#templateGenerator  .container_1'), logoObj.templatePath, 'frame', 0);
				logoObj.templatePath.updates.frame.x = obj.x;
				logoObj.templatePath.updates.frame.y = obj.y;
				logoObj.templatePath.updates.frame.scale = obj.scale;
			}

			if (p_oCurrContainerBodyObj) {
				debugConsole("p_oCurrContainerBodyObj:=" + getValidJsonStringifyObj(p_oCurrContainerBodyObj));
				obj = updateGroupSizeByLastValue($('#templateGenerator  .containerBody'), p_oCurrContainerBodyObj);

			} else {
				obj = updateGroupSize($('#templateGenerator  .containerBody'), logoObj.templatePath, 'containerBody');

			}
			logoObj.templatePath.updates.containerBody.x = obj.x;
			logoObj.templatePath.updates.containerBody.y = obj.y;
			logoObj.templatePath.updates.containerBody.scale = obj.scale;

			obj = updateGroupSize($('#templateGenerator  .logoContainerBox'), logoObj.templatePath, 'logoContainer', 0);
			logoObj.templatePath.updates.logoContainer.x = obj.x;
			logoObj.templatePath.updates.logoContainer.y = obj.y;
			logoObj.templatePath.updates.logoContainer.scale = obj.scale;

			template = $("#templateGenerator").html();
			$("#templateGenerator").html('');
			debugConsole("------------------------------------");
			return { 'logoObj': logoObj, 'html': template };

		},
		/**
		 * compare two array 
		 * @param {*} fst 
		 * @param {*} scnd 
		 */
		isEqualArray: function (fst, scnd) {
			var equal = true;
			$.each(fst, function (k, v) {
				if (v != scnd[k]) {
					equal = false;
				}
			});
			return equal;
		}
	}
	/**
	 * New code ends here
	 */
	$('[data-toggle="tooltip"]').tooltip();
	// editors related functios
	var lEditor = (function () {
		var obj = {};
		currentStep = 1;
		obj.objIconSearch = 0;
		obj.owl = {};
		obj.objIconPage = 1;
		obj.nextIconSearch = true;
		obj.sampleIconArr = [];
		obj.currentLogo = {};
		obj.logoTempArr = [];
		obj.randomSliderSet = [];
		obj.fontsArray = [];
		obj.sliderData = {
			frames: [],
			iconsId: [],
			originalIcons: [],
			icons: [],
			textWithFonts: [],
			sloganWithFonts: [],
			templates: templatesData,
		};
		obj.iconNameSpaceList = [];
		obj.setSession = function (key, value) {
			try {
				sessionStorage.setItem(key, value);
			}
			catch (e) {
				editor_exceptions.push(e);
			}
		}

		obj.getSession = function (key) {
			return sessionStorage.getItem(key);
		}
		obj.indusType = obj.getSession('industryType');
		obj.budgetShowType = obj.getSession('budgetShowType');

		obj.cleanSession = function (key) {
			sessionStorage.removeItem(key);
		}
		obj.currentFontFamily = function () {

		}
		/**
		 * Top header Menus of editors
		 */
		obj.showNav = function (targetNav) {
			debugConsole("showNav targetNav:=" + targetNav)
			var menuStep = $(targetNav).parents('.menuSteps').data('menuid');
			var targetAttr = $(targetNav).data('option');
			debugConsole("menuStep:=" + menuStep);
			debugConsole("targetAttr:=" + targetAttr);
			switch (menuStep) {

				case 1: {
					$('.menu_' + menuStep + ' li').removeClass('active');
					$(targetNav).parent('li').addClass('active');
					$('.commonEditSection').addClass('hidden');
					$(targetAttr).removeClass('hidden');
					$('.previewSection').removeClass('hidden');
					if (targetAttr != '') {
						$('.menu_2').removeClass('hidden');
					} else {
						$('.menu_2').addClass('hidden');
					}
					break;
				}
				case 2: {
					var subMenuStep = $(targetNav).parents('.commonEditSection').data('submenuid');
					var parentLink = obj.getSession('parentlink');
					if (parentLink != 3) {
						$('.submenu_' + subMenuStep + ' li').removeClass('active');
						$(targetNav).parent('li').addClass('active');
					}

					$('.submenu_' + subMenuStep + ' .logoSettings').addClass('hidden');
					$(targetAttr).removeClass('hidden');
					break;
				}

			}
		}

		obj.checkEditColorMenu2 = function () {

			$(".submenu_3").find('[class^="subMenu"]').parent('li').removeClass('active');
			$(".submenu_3").find('[class^="subMenu"]').parent('li').addClass('disabled');

			$(".submenu_3").find(".subMenu-12").parent('li').removeClass('disabled');
			$(".submenu_3").find(".subMenu-13").parent('li').removeClass('disabled');
			$(".submenu_3").find(".subMenu-26").parent('li').removeClass('disabled');

			if (lEditor.currentLogo.sloganName && lEditor.currentLogo.sloganName !== "" && lEditor.currentLogo.sloganName !== '') {
				$(".submenu_3").find(".subMenu-14").parent('li').removeClass('disabled');
			}
			if (lEditor.currentLogo.generate.templatePath.isIcon == 1 || lEditor.currentLogo.generate.templatePath.isMono == 1) {
				$(".submenu_3").find(".subMenu-15").parent('li').removeClass('disabled');
			}
			if ((lEditor.currentLogo.generate.templatePath.isIcon == 1 || lEditor.currentLogo.generate.templatePath.isMono == 1) && lEditor.currentLogo.generate.templatePath.isIconFrame == 1) {
				$(".submenu_3").find(".subMenu-43").parent('li').removeClass('disabled');
			}
			if (lEditor.currentLogo.generate.templatePath.isFrame == 1) {
				$(".submenu_3").find(".subMenu-16").parent('li').removeClass('disabled');
			}

		}

		obj.editLogoSteps = function () {
			debugConsole("editLogoSteps");
			var getLink, parentLink, colorDataType;

			getLink = obj.getSession('targetlink');
			parentLink = obj.getSession('parentlink');
			var defaultLink = obj.getSession('defaultlink');

			colorDataType = obj.getSession('colorDataType');
			obj.currentLogo = getValidJsonParseObj(obj.getSession('currentLogo'));
			obj.currentFontFamily();
			$('.textFontFamily a, .sloganFontFamily a').removeClass('active');
			debugConsole("getLink:=" + getLink);
			debugConsole("parentlink:=" + parentLink);
			$('.editTags').val('');

			if (typeof jqXHR !== 'undefined') {
				jqXHR.abort();

			}
			if (typeof jqXHR1 !== 'undefined') {
				jqXHR1.abort();
			}

			if (getLink == 'undefined' || getLink == null) {
				getLink = 1;
			}

			if (getLink == 2 && defaultLink == null && parentLink == null) {
				$('.subMenu-7').trigger('click');
			}

			if (parentLink == 'undefined' || parentLink == null) {
				parentLink = getLink;
			}
			if (getLink == 12) {
				$('.mobileColorpicker').addClass('bgcolor');
			}
			else {
				$('.mobileColorpicker').removeClass('bgcolor');
			}
			getLink = parseInt(getLink);
			showEditOuterContainer(getLink);
			showEditInnerContainer(getLink);
			switch (getLink) {

				case 1: {
					$('.topParent-2').trigger('click');
					$('.previewSection').removeClass('hidden');
					$('.editFinalLogo, .editLogoSlider').addClass('hidden');
					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.menu_2').addClass('hidden');
					obj.previewColors();
					obj.previewLogo();
					$('[data-toggle="tooltip"]').tooltip();
					$('.finaLogoInner').html('');
					break;
				}
				case 2: {
					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider').addClass('hidden');
					obj.getCurrentLogo();
					obj.previewColors();
					obj.previewLogo();
					disableOption();
					if (rangeSliderFlag) {
						var frameSlider = obj.getSession('frameSizeSlider');
						$(".frameSizeSlider").slider("option", "value", frameSlider);
					}
					// $('.subMenu-7').trigger('click');
					break;
				}

				case 3: {
					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider').addClass('hidden');
					obj.getCurrentLogo();
					obj.previewColors();
					obj.previewLogo();
					disableOption();
					break;
				}

				case 4: {
					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider').addClass('hidden');
					obj.getCurrentLogo();
					break;
				}
				case 5: {
					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider').addClass('hidden');
					obj.getCurrentLogo();
					obj.previewColors();
					obj.previewLogo();
					if (parseInt(obj.currentLogo.generate.templatePath.isIcon) == 1) {
						isIconAvail();
						debugConsole("aaaaaaaaaaaaaaaaaaa");
					}
					else if (parseInt(obj.currentLogo.generate.templatePath.isMono) == 1) {
						isMonoAvail();
						debugConsole("bbbbbbbbbbbbbbbbbb");
					}
					else {
						debugConsole("cccccccccccccccccc");
					}
					break;
				}

				case 6: {
					$('.editFinalLogo, .currentLogoBox, .previewSection').removeClass('hidden');
					$('.editLogoSlider').addClass('hidden');
					obj.getCurrentLogo();
					obj.previewColors();
					obj.previewLogo();
					if (rangeSliderFlag) {
						var frameSlider = obj.getSession('frameSizeSlider');
						$(".frameSizeSlider").slider("option", "value", frameSlider);
					}
					$('.submenu_2').addClass('hidden');
					break;
				}

				case 7: {

					$('.editFinalLogo, .currentLogoBox, .previewSection').removeClass('hidden');
					$('.editLogoSlider').addClass('hidden');
					obj.previewColors();
					obj.previewLogo();
					obj.getCurrentLogo();
					disableOption();
					break;
				}

				case 8: {
					$('.editFinalLogo, .previewSection').addClass('hidden');
					$('.editLogoSlider, .currentLogoBox').removeClass('hidden');
					// var objs = $('.textFontFamily a:first-child');
					var objs = $('.textFontFamily').find('a[data-fontfamily="bubbly"]');
					$('.textFontFamily a').removeClass('active');
					objs.addClass('active');
					editorParameters = {};
					editorParameters.obj = objs;
					editorParameters.fors = 'logo';
					loadMoreStart = 0;
					logoByfontFamily(editorParameters);
					break;
				}

				case 9: {
					$('.editFinalLogo, .currentLogoBox, .previewSection').removeClass('hidden');
					$('.editLogoSlider').addClass('hidden');
					obj.previewColors();
					obj.previewLogo();
					obj.getCurrentLogo();
					if (rangeSliderFlag) {
						var frameSlider = obj.getSession('textSloganDistSlider');
						$(".textSloganDistSlider").slider("option", "value", frameSlider);
					}
					// var sloganText = lEditor.getSession('sloganText');
					// if (sloganText == '') {
					// 	updateLogoText(constantVars.targets[lEditor.getSession('targetlink')], '', getSliderValue('sloganTextSize'), getSliderValue('sloganLetterSpacing'), '');
					// }
					disableOption();
					break;
				}
				case 10: {
					$('.editFinalLogo, .previewSection').addClass('hidden');
					$('.editLogoSlider, .currentLogoBox').removeClass('hidden');
					// var objs = $('.sloganFontFamily a:first-child');
					var objs = $('.sloganFontFamily').find('a[data-fontfamily="bubbly"]');
					// $('.sloganFontFamily').removeClass('active');
					$('.sloganFontFamily a').removeClass('active');
					$(objs).addClass('active');
					editorParameters = {};
					editorParameters.obj = objs;
					editorParameters.fors = 'slogan';
					loadMoreStart = 0;
					logoByfontFamily(editorParameters);

					break;
				}
				case 11: {
					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider, .previewSection').addClass('hidden');
					obj.getCurrentLogo();
					if (rangeSliderFlag) {
						var frameSlider = obj.getSession('textSloganDistSlider');
						$(".textSloganDistSlider").slider("option", "value", frameSlider);
					}
					disableOption();
					break;
				}
				case 12: {
					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider').addClass('hidden');
					obj.getCurrentLogo();
					break;
				}
				case 13: {
					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider').addClass('hidden');
					obj.previewColors();
					obj.previewLogo();
					obj.getCurrentLogo();
					break;
				}
				case 14: {
					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider').addClass('hidden');
					obj.previewColors();
					obj.previewLogo();
					obj.getCurrentLogo();
					break;
				}
				case 15: {
					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider').addClass('hidden');
					obj.previewColors();
					obj.previewLogo();
					obj.getCurrentLogo();
					break;
				}
				case 16: {
					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider').addClass('hidden');
					obj.previewColors();
					obj.previewLogo();
					obj.getCurrentLogo();
					break;
				}
				case 17: {

					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider, .previewSection').addClass('hidden');
					obj.getCurrentLogo();
					break;
				}

				case 18: {

					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider, .previewSection').addClass('hidden');
					obj.getCurrentLogo();
					break;
				}

				case 19: {

					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider, .previewSection').addClass('hidden');
					obj.getCurrentLogo();
					break;
				}
				case 20: {
					$('.editFinalLogo, .previewSection').addClass('hidden');
					$('.editLogoSlider, .currentLogoBox').removeClass('hidden');
					break;
				}
				case 21: {
					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider, .previewSection').addClass('hidden');
					break;
				}
				case 22: {
					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider, .previewSection').addClass('hidden');
					break;
				}
				case 23: {
					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider').addClass('hidden');
					logoByContainer();
					obj.getCurrentLogo();
					obj.previewColors();
					obj.previewLogo();
					break;
				}
				case 24: {
					if (obj.currentLogo.generate.templatePath.isFrame == 0 || $(".containerOptions").hasClass('active')) {
						$('.previewSection').addClass('hidden');
						$('.editFinalLogo').addClass('hidden');
						$('.editLogoSlider').removeClass('hidden');
						loadMoreStart = 0;
						logoByContainer();
					} else {
						$('.editFinalLogo').removeClass('hidden');
						$('.editLogoSlider').addClass('hidden');
						obj.getCurrentLogo();
					}
					break;
				}

				case 25: {
					obj.setSession('targetlink', 2);
					obj.setSession('parentlink', 2);
					break;
				}

				case 26: {
					$('.colorPaletteButton').addClass('active');
					$('.editFinalLogo, .previewSection').addClass('hidden');
					$('.editLogoSlider, .currentLogoBox').removeClass('hidden');
					editorParameters = {};
					editorParameters.id = 0;
					loadMoreStart = 0;
					$('.finalogoSlider').html('');
					palettsColorVariation(editorParameters);
					break;
				}
				case 27: {

					$('.editFinalLogo, .previewSection, editSymbolsSection').addClass('hidden');
					$('.editLogoSlider, .currentLogoBox, .symbolVariations').removeClass('hidden');
					onSymbolSearchClick();

					break;
				}
				case 28: {
					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider, .previewSection').addClass('hidden');
					obj.getCurrentLogo();
					break;
				}
				case 29: {
					$('.editFinalLogo, .previewSection').addClass('hidden');
					$('.editLogoSlider, .currentLogoBox').removeClass('hidden');
					loadMoreStart = 0;
					getLayoutVariations();

					break;
				}
				case 30: {
					$('.editFinalLogo, .previewSection').addClass('hidden');
					$('.editLogoSlider, .currentLogoBox').removeClass('hidden');
					loadMoreStart = 0;
					obj.generateDynamicLogoVariations();
					break;
				}
				case 31: {

					$('.editFinalLogo, .currentLogoBox, .previewSection').removeClass('hidden');
					$('.editLogoSlider').addClass('hidden');
					$('.submenu_2').addClass('hidden');
					obj.previewColors();
					obj.previewLogo();
					obj.getCurrentLogo();
					isIconAvail();
					break;
				}
				case 32: {

					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider').addClass('hidden');
					obj.previewColors();
					obj.previewLogo();
					obj.getCurrentLogo();
					loadMoreStart = 0;
					isMonoAvail();

					break;
				}

				case 34: {
					obj.setSession('targetlink', 2);
					obj.setSession('parentlink', 2);
					break;
				}

				case 39: {

					$('.editFinalLogo, .previewSection, editMonoSection').addClass('hidden');
					$('.editLogoSlider, .currentLogoBox, .monoVariations').removeClass('hidden');
					loadMoreStart = 0;
					$('.editMonogramText').val(lEditor.getMonogramText(true));
					lEditor.getMonogramVariations("");
					break;
				}
				case 40: {
					if (obj.currentLogo.generate.templatePath.isIconFrame == 0 || $(".innerContainerOptions").hasClass('active')) {
						$('.editFinalLogo, .previewSection').addClass('hidden');
						$('.editLogoSlider, .currentLogoBox').removeClass('hidden');
						loadMoreStart = 0;
						logoByIconContainer();
					} else {
						$('.editFinalLogo, .previewSection, .currentLogoBox').removeClass('hidden');
						$('.editLogoSlider').addClass('hidden');
						obj.getCurrentLogo();
					}
					break;
				}
				case 41: {
					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider').addClass('hidden');
					logoByIconContainer();
					obj.previewColors();
					obj.previewLogo();
					obj.getCurrentLogo();
					break;
				}
				case 42: {
					$('.editLogoSlider').removeClass('hidden');
					$('.editFinalLogo, .previewSection').addClass('hidden');
					loadMoreStart = 0;
					logoByContainer();
					break;
				}
				case 43: {
					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider').addClass('hidden');
					obj.previewColors();
					obj.previewLogo();
					obj.getCurrentLogo();
					break;
				}
				case 44: {
					$('.editLogoSlider').removeClass('hidden');
					// $('.editFinalLogo, .currentLogoBox, .previewSection').addClass('hidden');
					$('.editFinalLogo, .previewSection').addClass('hidden');
					loadMoreStart = 0;
					logoByIconContainer();
					break;
				}

			}
			debugConsole("parentLink:=" + parentLink);

			if ((parentLink == 3 || parentLink == 5 || parentLink == 6 || parentLink == 30) && getLink == 2) {
				getLink = "undefined";
				obj.setSession('targetlink', getLink);
			}

			$('.topParent-' + parentLink).parent('li').addClass('active');
			$('.topParent-' + getLink).parent('li').addClass('active');
			if (parentLink != 3) {
				$('[class^="subMenu"]').parent('li').removeClass('active');
				$('.subMenu-' + getLink).parent('li').addClass('active');
			}
			// $('[class^="subMenu"]').addClass('hidden');
			$('.subMenu-' + defaultLink).parent('li').addClass('active');
			$('[class^="subChild"]').addClass('hidden');
			$('.menu_2, .submenu_' + parentLink + ', .subChild-' + getLink + ', .subChild-' + defaultLink).removeClass('hidden');
			debugConsole("defaultLink:=" + defaultLink);
			debugConsole("getLink:=" + getLink);

			obj.checkEditColorMenu2();

			if (parentLink == 3) {
				if (colorDataType === 'undefined' || colorDataType == null) {
					obj.setSession('colorDataType', 'background');
					colorDataType = "background";

					if (getLink == 13 || getLink == 14 || getLink == 15 || getLink == 43 || getLink == 16) {
						obj.setSession('colorDataType', 'foreground');
						colorDataType = "foreground";
					}
				}

				if (colorDataType == 'background' || colorDataType == 'colorVar') {
					$('[class^="subMenu"]').parent('li').removeClass('active');
					$('.subMenu-' + getLink).parent('li').addClass('active');
					$('.subMenu-' + defaultLink).parent('li').addClass('active');
				}

				if (colorDataType == 'foreground') {
					$('[class^="subMenu"]').parent('li').removeClass('active');
					$('.subMenu-' + getLink).parent('li').addClass('active');
					if (getLink == 13 || getLink == 14 || getLink == 15 || getLink == 43 || getLink == 16) {
						if ($('.subMenu-' + getLink).parent('li').hasClass('disabled') && $('.subMenu-' + getLink).parent('li').hasClass('active')) {
							$('.subMenu-' + getLink).parent('li').removeClass('active');
							$(".logoEditOptions").find(".subChild-" + getLink).addClass("hidden");
						}
					}
				}
			}



			if (($(".subChild-" + getLink).length) || ($(".subChild-" + defaultLink).length)) {
				debugConsole("colorDataType:=" + colorDataType);
				let subChildNum;
				if (defaultLink && defaultLink != "undefined") {
					subChildNum = defaultLink;
				} else {
					subChildNum = getLink;
				}
				debugConsole("subChildNum1111111:=" + subChildNum);
				switch (colorDataType) {
					case "background":
						updateColorPickerValue(lEditor.currentLogo.generate.bgColor, false, "", 0);
						break;
					case "foreground":
						switch (subChildNum) {
							case 13:
								debugConsole("lEditor.currentLogo.generate.mainTextColor:=" + lEditor.currentLogo.generate.mainTextColor);
								debugConsole("lEditor.currentLogo.generate.mainText2Color:=" + lEditor.currentLogo.generate.mainText2Color);
								updateColorPickerValue(lEditor.currentLogo.generate.mainTextColor, false, "", 0);
								break;
							case 14:
								updateColorPickerValue(lEditor.currentLogo.generate.sloganTextColor, false, "", 0);
								break;
							case 15:
								updateColorPickerValue(lEditor.currentLogo.generate.iconColor, false, "", 0);
								break;
							case 43:
								updateColorPickerValue(lEditor.currentLogo.generate.iconFrameColor, false, "", 0);
								break;
							case 16:
								if (lEditor.currentLogo.generate.templatePath.frameType === "filled") {
									updateColorPickerValue(lEditor.currentLogo.generate.frameFilledColor, false, "", 0);
								} else {
									updateColorPickerValue(lEditor.currentLogo.generate.frameColor, false, "", 0);
								}
								break;
						}
						break;
				}

			}

			checkFrame(getLink);
			checkIconFrame();

			if (getLink == 42) {
				$('.subMenu-24').parent('li').addClass('active');
				$(getLink).parent('li').removeClass('active');
			}

			if (getLink == 44) {
				$('.subMenu-40').parent('li').addClass('active');
				$(getLink).parent('li').removeClass('active');
			}

			if (defaultLink == 1 && getLink == 1) {
				$('body').addClass('preview-header');
				$('.menu_2').addClass('hidden')
			} else {
				$('body').removeClass('preview-header');
				$('html, body').animate({ scrollTop: 0 });

			}

			$('.commonClrDiv a').removeClass('active');
			if (getLink != 27) {
				addEditOptions("all");
			}
			if (getLink == 27) {
				$('.editSymbolsSection').addClass('hidden');
				$('.symbolVariations, .subChild-31').removeClass('hidden');
				$('.subMenu-31').parent('li').addClass('active');
			}
			if (getLink == 39) {
				$('.editMonoSection').addClass('hidden');
				$('.monoVariations, .subChild-32').removeClass('hidden');
				$('.subMenu-32').parent('li').addClass('active');
			}


			clearOutlineBox();
			obj.showMultiLineTextTools(lEditor.currentLogo);
			createTempHint();

		}
		obj.showMultiLineTextTools = function (p_oCurrentLogo) {
			debugConsole("showMultiLineTextTools:=");
			if (p_oCurrentLogo && p_oCurrentLogo.generate) {
				debugConsole("p_oCurrentLogo.generate.templatePath.isDBLineCompanyText:=" + p_oCurrentLogo.generate.templatePath.isDBLineCompanyText);
				var parentDiv = null;
				if (p_oCurrentLogo.generate.templatePath.isDBLineCompanyText == "yes") {

					if ($('.subMenu-7').parent("li").hasClass("active")) {
						parentDiv = $('.subChild-7').find(".company-text-box");
						parentDiv.find('.single-line-company-text').addClass("hidden");
						parentDiv.find('.remove--margin').addClass("hidden");
						parentDiv.find('.double-line-company-text').removeClass("hidden");
						parentDiv.find('.company-text-dd').text(p_oCurrentLogo.logoName);
						parentDiv.addClass('double-line-container');

						parentDiv = null;

						parentDiv = $('.subChild-7').find(".company-text-fs-box");
						parentDiv.find('.single-line-company-text').addClass("hidden");
						parentDiv.find('.remove--margin').addClass("hidden");
						parentDiv.find('.double-line-company-text').removeClass("hidden");
						parentDiv.addClass('double-line-container');

						parentDiv = null;

						parentDiv = $('.subChild-7').find(".company-text-ls-box");
						parentDiv.find('.single-line-company-text').addClass("hidden");
						parentDiv.find('.remove--margin').addClass("hidden");
						parentDiv.find('.double-line-company-text').removeClass("hidden");
						parentDiv.addClass('double-line-container');
						//edit logo name
					}
					else if ($('.subMenu-13').parent("li").hasClass("active")) {
						parentDiv = $('.subChild-13').find(".company-text-color-box");
						parentDiv.removeClass("hidden");
						parentDiv.attr("last_selected", "");
						// color
					}

					else if ($('.subMenu-8').parent("li").hasClass("active")) {
						parentDiv = $('.subChild-8').find(".company-text-font-box");
						parentDiv.removeClass("hidden");
						parentDiv.attr("last_selected", "");
						// font case
					}
					$(".editCompanyName.templateText").val(removeMultipleSpaces(lEditor.getSession("logoname")));
				} else {
					parentDiv = $('.subChild-7').find(".company-text-box");
					parentDiv.find('.single-line-company-text').removeClass("hidden");
					parentDiv.find('.remove--margin').removeClass("hidden");
					parentDiv.find('.double-line-company-text').addClass("hidden");
					parentDiv.removeClass('double-line-container');

					parentDiv = null;

					parentDiv = $('.subChild-7').find(".company-text-fs-box");
					parentDiv.find('.single-line-company-text').removeClass("hidden");
					parentDiv.find('.remove--margin').removeClass("hidden");
					parentDiv.find('.double-line-company-text').addClass("hidden");
					parentDiv.removeClass('double-line-container');

					parentDiv = null;

					parentDiv = $('.subChild-7').find(".company-text-ls-box");
					parentDiv.find('.single-line-company-text').removeClass("hidden");
					parentDiv.find('.remove--margin').removeClass("hidden");
					parentDiv.find('.double-line-company-text').addClass("hidden");
					parentDiv.removeClass('double-line-container');

					parentDiv = null;
					parentDiv = $('.subChild-8').find(".company-text-font-box");
					parentDiv.addClass("hidden");
					parentDiv.attr("last_selected", "");

					parentDiv = null;
					parentDiv = $('.subChild-13').find(".company-text-color-box");
					parentDiv.addClass("hidden");
					parentDiv.attr("last_selected", "");
				}
			}

			currentPopoverObj = null;

		}
		$(".show-db-line-edit-popover").parent().click(function () {
			var show_popup_for = $(this).children(".show-db-line-edit-popover").attr("show_popup_for")
			debugConsole("show_popup_for:=" + show_popup_for);
			if (currentPopoverBtn) {
				currentPopoverBtn.removeClass('off');
				currentPopoverBtn = null;
			}
			$(this).addClass('off');
			if (currentPopoverObj) {
				if (currentPopoverObj.length && (currentPopoverObj.attr("pop_over_shown") === "true")) {
					currentPopoverObj.popover('hide');
					currentPopoverObj.attr('pop_over_shown', 'false');
				}
			}

			currentPopoverObj = null;
			currentPopoverBtn = $(this);
			switch (show_popup_for) {
				case "edit_text":
					$('#edit_the_lines_text_dd').popover('show');
					$('#edit_the_lines_text_dd').attr('pop_over_shown', 'true');
					currentPopoverObj = $('#edit_the_lines_text_dd');
					break;
				case "edit_fs":
					$('#edit_the_lines_fs_dd').popover('show');
					$('#edit_the_lines_fs_dd').attr('pop_over_shown', 'true');
					currentPopoverObj = $('#edit_the_lines_fs_dd');
					break;
				case "edit_ls":
					$('#edit_the_lines_ls_dd').popover('show');
					$('#edit_the_lines_ls_dd').attr('pop_over_shown', 'true');
					currentPopoverObj = $('#edit_the_lines_ls_dd');
					break;
				case "change_font":
					$('#edit_the_lines_font_change_dd').popover('show');
					$('#edit_the_lines_font_change_dd').attr('pop_over_shown', 'true');
					currentPopoverObj = $('#edit_the_lines_font_change_dd');
					break;
				case "change_color":
					$('#edit_the_lines_color_change_dd').popover('show');
					$('#edit_the_lines_color_change_dd').attr('pop_over_shown', 'true');
					currentPopoverObj = $('#edit_the_lines_color_change_dd');
					break;
			}

		});
		obj.modifyLogoProperties = function (propName) {
			if (version == "v6") {
				$(".step6-preview-section").find('.finalogo--inner-wait').removeClass("hidden");
				$(".step6-preview-section").find('.finaLogoInner').addClass("hidden");
				$(".step6-preview-section").find('.flex-container').addClass("hidden");
				$('.logo-bottom-strip .bottom-right .common-btn').addClass("disabled");
			}
			var companyName = lEditor.getSession('logoname');
			var logoTextList = lEditor.getLogoTextList(companyName);
			var sloganName = lEditor.getSession('sloganText');

			var tempLogoArray1 = JSON.parse(JSON.stringify(obj.logoTempArr));
			var tempLogoArray = [];
			debugConsole("companyName:=" + companyName);
			debugConsole("logoTextList length:=" + logoTextList.length);
			$.each(tempLogoArray1, function (k, v) {
				var item = tempLogoArray1[k];
				if (item.generate.templatePath.template_db_id == item.generate.templatePath.template_id) {
					tempLogoArray.push(v);
				} else {
					if (logoTextList.length > 0 && logoTextList.length == 2 && (item.generate.templatePath.template_db_id == item.generate.templatePath.template_id + ".1")) {
						tempLogoArray.push(v);
					}
				}
			});
			debugConsole("tempLogoArray:=" + tempLogoArray.length);
			if (tempLogoArray.length > 2) {
				if ((tempLogoArray.length % 2) == 1) {
					tempLogoArray.pop();
					// add this condition because make 2 sets of logo
				}
			}

			debugConsole("tempLogoArray:=" + tempLogoArray.length);
			var promiseArray = [];
			$('.sliderContainer').html('');
			var previewStyle = "pointer-events:auto";

			var templateIdStyle = getTempStyle();
			var templateHint = "";


			for (let index = 0; index < tempLogoArray.length; index++) {

				var item = tempLogoArray[index];
				promiseArray.push((function (index, item) {
					return new Promise((resolve, reject) => {
						var logoHtml;
						var returnObj
						switch (propName) {
							case "logoname":
								obj.modifiedLogoTextAtStep6(item, logoTextList, companyName, function (p_sType) {
									if (p_sType == "yes") {
										item.logoName1 = logoTextList[0];
										item.logoName2 = logoTextList[1];
										item.logoName = logoTextList[0] + " " + logoTextList[1];
									} else {
										item.logoName = companyName;
									}
									obj.modifiedMonogramAtStep6(item, function () {
										item.generate.templatePath.sloganSetAsPerText = 0;

										if (logoMakerFunction.checkTemplateIsEqualCondition(item.generate)) {
											item.generate.templatePath.sloganSetAsPerText = 1;
										}
										obj.modifiedSloganAtStep6(item, companyName, sloganName, logoTextList, false, function (p_bValue) {
											debugConsole("p_bValue:=" + p_bValue);
											returnObj = logoMakerFunction.generateLogoTemplate(item.generate, item.idKey, null, null, null, p_bValue, "");
											item.generate.sloganFontObject = "";
											templateHint = showLogoAdminIds(item.generate.templatePath, "", item.fId, item.cpId, item.sfId, item.frmId, item.iconFrameId, item.monofId);

											if (version == "v6") {

												logoHtml = '<div class="logos--boxes" data-sfId ="' + item.sfId + '" data-fId ="' + item.fId + '" data-frmId ="' + item.frmId + '" data-cpId ="' + item.cpId + '"><div class="logo--slides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="preview--btn overlay-preview" style=' + previewStyle + '></div><div class="logo-favourite iconFav" data-toggle="tooltip" title="Add to favorites" data-type="favorite" data-id="' + index + '" data-logo-id="0"><i class="icon icon-heart"></i></div><div><div class="icons-edit icons-preview iconEdit" data-id="' + index + '" data-type="edit" data-logo-id="0"><span class="preview--btn" style=' + previewStyle + '>Preview logo</span><span class="edit--btn">Edit logo</span></div></div></div><div><div class="svg--slide" style="background-color:' + item.generate.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + returnObj.html + '</div></div></div></div>';
											} else {
												logoHtml = '<div class="logos--boxes" data-sfId ="' + item.sfId + '" data-fId ="' + item.fId + '" data-frmId ="' + item.frmId + '" data-cpId ="' + item.cpId + '" ><div class="logo--slides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="logo-favourite iconFav" data-toggle="tooltip" title="Add to favorites" data-type="favorite" data-id="' + index + '" data-logo-id="0"><i class="icon icon-heart"></i></div><div class="logoSlide-overlay gradient-div"><div class="icons-edit icons-preview iconEdit edit--btn" data-id="' + index + '" data-type="edit" data-logo-id="0"><span class="edit--btn">Edit logo<span class="edit--btn"></span></span></div></div><div class="svg--slide" style="background-color:' + item.generate.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + returnObj.html + '</div></div></div></div>';
											}
											item = updateCurrLogoObject(item);
											resolve({
												item: item
												, logoHtml: logoHtml
											});
										});
									});
								})
								break;
							case "sloganText":
								obj.modifiedSloganAtStep6(item, companyName, sloganName, logoTextList, true, function (isEqualCaseSloganLetterSpacing) {
									returnObj = logoMakerFunction.generateLogoTemplate(item.generate, item.idKey, null, null, null, false, "");

									templateHint = showLogoAdminIds(item.generate.templatePath, sloganName, item.fId, item.cpId, item.sfId, item.frmId, item.iconFrameId, item.monofId);

									if (version == "v6") {

										logoHtml = '<div class="logos--boxes" data-sfId ="' + item.sfId + '" data-fId ="' + item.fId + '" data-frmId ="' + item.frmId + '" data-cpId ="' + item.cpId + '"><div class="logo--slides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="preview--btn overlay-preview" style=' + previewStyle + '></div><div class="logo-favourite iconFav" data-toggle="tooltip" title="Add to favorites" data-type="favorite" data-id="' + index + '" data-logo-id="0"><i class="icon icon-heart"></i></div><div><div class="icons-edit icons-preview iconEdit" data-id="' + index + '" data-type="edit" data-logo-id="0"><span class="preview--btn" style=' + previewStyle + '>Preview logo</span><span class="edit--btn">Edit logo</span></div></div></div><div><div class="svg--slide" style="background-color:' + item.generate.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + returnObj.html + '</div></div></div></div>';
									} else {
										logoHtml = '<div class="logos--boxes" data-sfId ="' + item.sfId + '" data-fId ="' + item.fId + '" data-frmId ="' + item.frmId + '" data-cpId ="' + item.cpId + '" ><div class="logo--slides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="logo-favourite iconFav" data-toggle="tooltip" title="Add to favorites" data-type="favorite" data-id="' + index + '" data-logo-id="0"><i class="icon icon-heart"></i></div><div class="logoSlide-overlay gradient-div"><div class="icons-edit icons-preview iconEdit edit--btn" data-id="' + index + '" data-type="edit" data-logo-id="0"><span class="edit--btn">Edit logo<span class="edit--btn"></span></span></div></div><div class="svg--slide" style="background-color:' + item.generate.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + returnObj.html + '</div></div></div></div>';
									}
									if (isEqualCaseSloganLetterSpacing != -1) {
										item.generate.sloganLetterSpacing = isEqualCaseSloganLetterSpacing;
									}
									item = updateCurrLogoObject(item);
									resolve({
										item: item
										, logoHtml: logoHtml
									});

								});
								break;
						}
					});
				}(index, item))
				);
			}
			Promise.all(promiseArray).then(results => {
				var tempArray = [];
				for (let index = 0; index < results.length; index++) {
					$(".sliderContainer").append(results[index].logoHtml);
					tempArray.push(results[index].item);
				}
				obj.logoTempArr = tempArray;
				dynamicLogoCounter = (tempArray.length);
				if (version == "v6") {
					higlightLogoSlides(true, null);
					previewLogoAtStep6(0, true);
				}
			})
		}
		/**
		 * 
		 */
		obj.modifiedLogoTextAtStep6 = function (item, logoTextList, companyName, p_fCallBack) {
			var logo;
			if ((item.generate.templatePath.isDBLineCompanyText == "yes") && logoTextList.length > 0 && logoTextList.length == 2) {
				opentype.load(item.generate.textFontType, function (err, font) {

					logo = font.getPath(logoTextList[0], 0, 0, constantVars.ORIGINAL_SPACING.logoTextSlider, { 'letterSpacing': constantVars.ORIGINAL_SPACING.logoLetterSpacing });
					item.generate.logoPath1 = logo.toSVG();
					item.logoName1 = logoTextList[0];


					opentype.load(item.generate.text2FontType, function (err, font) {
						debugConsole("here1");
						logo = null;
						logo = font.getPath(logoTextList[1], 0, 0, constantVars.ORIGINAL_SPACING.logoTextSlider, { 'letterSpacing': constantVars.ORIGINAL_SPACING.logoLetterSpacing });
						item.generate.logoPath2 = logo.toSVG();
						item.logoName1 = logoTextList[1];
						item.logoName = logoTextList[0] + " " + logoTextList[1];
						if (p_fCallBack) {
							p_fCallBack("yes");
						}
					});
				});
			} else {
				opentype.load(item.generate.textFontType, function (err, font) {
					debugConsole("here2");
					logo = font.getPath(companyName, 0, 0, constantVars.ORIGINAL_SPACING.logoTextSlider, { 'letterSpacing': constantVars.ORIGINAL_SPACING.logoLetterSpacing });
					item.generate.logoPath = logo.toSVG();
					item.logoName = companyName;
					if (p_fCallBack) {
						p_fCallBack("no");
					}
				});
			}
		}
		/**
		 * 
		 */
		obj.modifiedMonogramAtStep6 = function (item, p_fCallBack) {
			var logo;
			if (item.generate.templatePath.isMono == 1) {
				opentype.load(item.generate.fontName, function (err, monoFont) {
					var monoText = lEditor.getMonogramText(false);
					lEditor.setMonogramText(monoText);
					var monoPath = monoFont.getPath(monoText, 0, 0, constantVars.ORIGINAL_SPACING.monogramTextSize);
					item.generate.iconPath = monoPath.toSVG();
					if (p_fCallBack) {
						p_fCallBack();
					}
				});
			} else {
				if (p_fCallBack) {
					p_fCallBack();
				}
			}
		}
		/**
		 * 
		 */
		obj.modifiedSloganAtStep6 = function (item, companyName, sloganName, logoTextList, isChangeSlogan, p_fCallBack) {
			if (sloganName && sloganName.length > 0) {
				opentype.load(item.generate.sloganFontType, function (err, font) {
					if (isChangeSlogan) {

						var isEqualCaseSloganLetterSpacing = constantVars.ORIGINAL_SPACING.sloganLetterSpacing;

						item.generate.templatePath.sloganSetAsPerText = 0;

						if (logoMakerFunction.checkTemplateIsEqualCondition(item.generate)) {
							var logoNameLength;
							if (item.generate.templatePath.isDBLineCompanyText == "yes" && logoTextList.length > 0 && logoTextList.length == 2) {
								logoNameLength = Math.max(logoTextList[0].length, logoTextList[1].length);
							} else {
								logoNameLength = companyName.length;
							}

							var sloganNameLength = sloganName.length;
							debugConsole("logoNameLength:=" + logoNameLength);
							debugConsole("sloganNameLength:=" + sloganNameLength);
							if (logoNameLength >= sloganNameLength) {
								if (sloganNameLength >= 20) {
									isEqualCaseSloganLetterSpacing = (sloganNameLength + logoNameLength) / 2;
								} else {
									isEqualCaseSloganLetterSpacing = (sloganNameLength + logoNameLength);
								}
								item.generate.sloganLetterSpacing = isEqualCaseSloganLetterSpacing;
								item.generate.templatePath.sloganSetAsPerText = 1;
							} else if (sloganNameLength >= logoNameLength) {
								if (sloganNameLength / 2 < logoNameLength) {
									isEqualCaseSloganLetterSpacing = (sloganNameLength + logoNameLength);
									item.generate.sloganLetterSpacing = isEqualCaseSloganLetterSpacing;
									item.generate.templatePath.sloganSetAsPerText = 1;
								}
							}
						}
						var logo = font.getPath(sloganName, 0, 0, constantVars.ORIGINAL_SPACING.sloganTextSize, { 'letterSpacing': parseFloat(isEqualCaseSloganLetterSpacing) });
						item.sloganName = sloganName;
						item.generate.sloganPath = logo.toSVG();
						if (p_fCallBack) {
							p_fCallBack(isEqualCaseSloganLetterSpacing);
						}
					} else {
						item.generate.sloganFontObject = font;
						if (p_fCallBack) {
							p_fCallBack(true);
						}
					}
				});
			} else {
				if (isChangeSlogan) {
					item.sloganName = sloganName;
					item.generate.sloganPath = "";
				}
				if (p_fCallBack) {
					p_fCallBack(-1);
				}
			}
		}
		obj.activateSelectedColors = function () {
			var colorBoxes = $('.color-selection.colorContainer .color');

			colorBoxes.removeClass('active');
			obj.refreshSelectedColorBox();
		}

		obj.refreshSelectedColorBox = function () {
			debugConsole("refreshSelectedColorBox");
			var selectedColors = getValidJsonParseObj(lEditor.getSession('sampleColor'));
			var selectedColorBox = $('.color-container .icons-container .colorContainerBoxes');

			selectedColorBox.removeClass('multi-gradient');
			$('.color-section .color-text')[selectedColors.length > 0 ? 'hide' : 'show']();
			selectedColorBox[selectedColors.length > 0 ? 'show' : 'hide']();

			for (let index = 0; index < selectedColors.length; index++) {
				$('.color-selection.colorContainer .color[data-sampleColorId="' + selectedColors[index].samplecolorid + '"]').addClass('active');
			}
			for (let index = 0; index < selectedColorBox.length; index++) {
				if (selectedColors[selectedColors.length - 1 - index]) {
					var item = $('.color-selection.colorContainer .color[data-sampleColorId="' + selectedColors[index].samplecolorid + '"]');
					$(selectedColorBox[index]).addClass('active');
					$(selectedColorBox[index]).attr('data-sampleColorId', selectedColors[index].samplecolorid);
					if (selectedColors[index].samplecolorid == -1) {
						selectedColorBox[index].style.background = 'transparent';
						$(selectedColorBox[index]).addClass('multi-gradient');
					}
					else {
						selectedColorBox[index].style.background = item.attr('data-sampleColor');
						$(selectedColorBox[index]).removeClass('multi-gradient');
					}
				}
				else if (selectedColorBox[index]) {
					$(selectedColorBox[index]).removeClass('active');
					selectedColorBox[index].style.background = '#ffffff';
					$(selectedColorBox[index]).removeAttr('data-sampleColorId');
				}
			}
			if (selectedColors.length > 3) {
				$('.color-selection-info').show();
				$('.color-selection-info').html('+ ' + (selectedColors.length - 3) + ' more');
			}
			else {
				$('.color-selection-info').hide();
				$('.color-selection-info').html('');
			}
		}
		/**
		 * 
		 */
		obj.getLogoTextList = function (p_sLogoName) {
			debugConsole("getLogoTextList:=" + p_sLogoName);
			if (p_sLogoName != " " && p_sLogoName) {
				p_sLogoName = removeMultipleSpaces(p_sLogoName);

				var logoNameList = [];
				if (p_sLogoName.indexOf("*") != -1) {
					logoNameList = p_sLogoName.split("*");
					return [logoNameList[0], logoNameList[1]];
				} else {
					debugConsole("p_sLogoName:=" + p_sLogoName);
					logoNameList = p_sLogoName.split(" ");
					debugConsole("logoNameList:=" + logoNameList.length);
					var firstPart;
					var lastPart;
					if (logoNameList.length >= 3) {
						if (logoNameList[0].length > logoNameList[logoNameList.length - 1].length) {
							var firstSpaceIndex = p_sLogoName.indexOf(" ");
							if (p_sLogoName.indexOf(" ") != -1) {
								firstPart = p_sLogoName.substr(0, firstSpaceIndex);
								lastPart = p_sLogoName.substr(firstSpaceIndex + 1);
								return [firstPart, lastPart];
							}
						} else {
							var lastSpaceIndex = p_sLogoName.lastIndexOf(" ");
							debugConsole("lastSpaceIndex:=" + lastSpaceIndex);
							if (lastSpaceIndex != -1) {
								firstPart = p_sLogoName.substr(0, lastSpaceIndex);
								lastPart = p_sLogoName.substr(lastSpaceIndex + 1);
								debugConsole("firstPart:=" + firstPart);
								debugConsole("lastPart:=" + lastPart);
								return [firstPart, lastPart];
							}
						}
					} else if (logoNameList.length == 2) {
						return [logoNameList[0], logoNameList[1]];
					}
				}
			}
			return [];
		}
		/**
		 * for generating dynamic logos for step - 6   	
		 */
		obj.generateDynamicLogos = function (isLoadMoreClick, p_fCallBack) {
			debugConsole("generateDynamicLogos");
			if (step6templatesData.length == 0) {
				forceConsoleAtStaging("templatesData:=" + JSON.stringify(step6templatesData));
			}
			var sloganFont;
			loadMoreStart++;
			randomPagination++;
			var limit = 10;
			if (loadMoreStart == 1) {
				randomPagination = loadMoreStart;
				lEditor.logoTempArr = [];
				lEditor.logoSlider('final', 1);
			}
			$('.step_6 .load-more-anim').addClass('loading');
			obj.getSliderDataIcons(function () {
				debugConsole("getSliderDataIcons");
				var savedColors = getValidJsonParseObj(obj.getSession('sampleColor'));
				var sessionColors = [];
				$.each(savedColors, function (k, v) {
					if (v.sasamplecolorid > -1) {
						sessionColors.push(v.samplecolorid);
					}
				});
				var fonts = [];
				var sloganFonts = [];
				var monoFonts = [];
				var iconFrames = [];
				var iconFrames = [];
				var frames = [];
				var pellets;

				jqXHR = $.ajax({
					url: DH.baseURL + '/logoMakerAjax.php',
					type: 'POST',
					data: { action: 'randomData', colors: sessionColors, start: randomPagination },
					success: function (json) {
						var json = getValidJsonParseObj(json);

						$.each(json.data.logoFonts, function (k, v) {
							fonts.push(v);
						});
						$.each(json.data.monoFonts, function (k, v) {
							monoFonts.push(v);
						});
						$.each(json.data.sloganFonts, function (k, v) {
							sloganFonts.push(v);
						});
						$.each(json.data.iconFrames, function (k, v) {
							iconFrames.push(v);
						});
						$.each(json.data.frames, function (k, v) {
							frames.push(v);
						});

						pellets = json.data.pellets;
						if (pellets.length < 10) {
							randomPagination = 0;
							if (pellets.length == 0) {
								obj.generateDynamicLogos(false, null);
							}
						}

						var logoText = obj.getSession('logoname');
						var logoTextList = obj.getLogoTextList(obj.getSession('logoname'));
						var templates = [];
						var icons = obj.sliderData.icons;
						var iconsId = obj.sliderData.iconsId;
						var isIconTemplate = 0;
						$.each(icons, function (keee, veee) {
							if (veee != "") {
								isIconTemplate = 1;
							}
						});
						debugConsole("step6templatesData.length:=" + step6templatesData.length);
						if (step6templatesData.length == 1) {
							templates = step6templatesData;
						} else {
							if (icons.length == 0 || isIconTemplate == 0) {
								$.each(step6templatesData, function (k, v) {
									if (v.isIcon == 0) {
										debugConsole("v.template_db_id:=" + v.template_db_id);
										debugConsole("v.template_code:=" + v.template_id);
										if (v.template_db_id == v.template_id) {
											templates.push(v);
										} else {
											if (logoTextList.length > 0 && logoTextList.length == 2 && (v.template_db_id == v.template_id + ".1")) {
												templates.push(v);
											}
										}
									}
								});
							} else {
								if (logoTextList.length > 0 && logoTextList.length == 2) {
									templates = step6templatesData;
								} else {
									$.each(step6templatesData, function (k, v) {
										if (v.template_db_id == v.template_id) {
											templates.push(v);
										}
									});
								}
							}
						}
						debugConsole("templates:=" + templates.length + ",,," + step6templatesData.length);

						var sloganText = obj.getSession('sloganText');
						var monoText = lEditor.getMonogramText(true);
						var slides = [];
						var arr = [];
						arr[0] = fonts.length; // text
						arr[1] = frames.length;
						arr[2] = icons.length;
						arr[3] = templates.length;
						arr[4] = pellets.length;
						arr[5] = sloganFonts.length;
						arr[6] = iconFrames.length;
						arr[7] = monoFonts.length;


						obj.randomSliderSet = [];
						var monoTemplate = 0;

						debugConsole("templates.length:=" + templates.length + ",,," + pellets.length);
						// as per below logic in inshow templates only one mono template will be on

						if (templates.length == 1) {
							for (i = 0; i < pellets.length; i++) {
								var comb = logoMakerFunction.getRandomCombination(arr);
								if (logoMakerFunction.isUniqueComination(obj.randomSliderSet, comb)) {
									obj.randomSliderSet.push(comb);
								}
							}
							debugConsole("yaha aaya:=" + obj.randomSliderSet);
						} else {
							debugConsole("isme aaya");
							for (i = 0; i < pellets.length; i++) {
								isCond = true;
								while (isCond) {
									var comb = logoMakerFunction.getRandomCombination(arr);
									// debugConsole("comb:=" + comb);
									if (logoMakerFunction.isUniqueComination(obj.randomSliderSet, comb)) {
										debugConsole("monoTemplate;=" + monoTemplate);
										// if (monoTemplate < 2) {
										debugConsole("templates[comb[3]].isMono:=" + templates[comb[3]] + ",,,," + comb[3] + ",,,," + templates.length);
										if (templates[comb[3]].isMono == 1) {
											obj.randomSliderSet.push(comb);
											isCond = false;
											monoTemplate++;
										} else {
											if (templates[comb[3]].isMono == 0) {
												// debugConsole("continue continue");
												obj.randomSliderSet.push(comb);
												isCond = false;
											}
											// continue;
										}
										// } else {
										// 	if (templates[comb[3]].isMono == 0) {
										// 		obj.randomSliderSet.push(comb);
										// 		isCond = false;
										// 	}
										// }

									}
								}
							}
						}

						var i = 0;
						obj.randomSliderSet = obj.randomSliderSet.map((a) => ({ sort: Math.random(), value: a })).sort((a, b) => a.sort - b.sort).map((a) => a.value);
						var randomObjLength = obj.randomSliderSet.length;
						var fontLoader = 0;

						// loaderShow();
						var j = (loadMoreStart - 1) * limit;
						var randomSlideArray = [];

						var templateIdStyle = getTempStyle();


						$.each(obj.randomSliderSet, function (k, v) {
							randomSlideArray.push(new Promise((success, failure) => {
								var monoPath = "";
								v[0] = fontLoader++;
								var logoTemp = {
									logoPath: "",
									logoPath1: "",
									logoPath2: "",
									sloganPath: "",
									framePath: "",
									iconFramePath: "",
									iconPath: "",
									templatePath: "",
									bgColor: ""
								};

								var promiseArr = [];

								promiseArr.push(new Promise((resolve, reject) => {
									if (fonts[v[0]].link && fonts[v[0]].link != "") {
										opentype.load(fonts[v[0]].link, function (err, font) {
											resolve({ font: font, type: 'company_name' });
										});
									}
								}));
								promiseArr.push(new Promise((resolve, reject) => {
									if (sloganFonts[v[5]].link && sloganFonts[v[5]].link != "") {
										opentype.load(sloganFonts[v[5]].link, function (err, font) {
											resolve({ font: font, type: 'slogan' });
										});
									}
								}));
								promiseArr.push(new Promise((resolve, reject) => {
									if (monoFonts[v[7]].link && monoFonts[v[7]].link != "") {
										opentype.load(monoFonts[v[7]].link, function (err, font) {
											resolve({ font: font, type: 'monofont' });
										});
									}
								}));

								Promise.all(promiseArr).then(newFonts => {
									var logo = null;

									logoTemp.templatePath = templates[v[3]];

									debugConsole("logoTemp.templatePath template_id11:=" + logoTemp.templatePath.template_id);
									debugConsole("logoTextList.length1111:=" + logoTextList.length);
									if (logoTextList.length == 2 && logoTemp.templatePath.text1 && logoTemp.templatePath.text2 && logoTemp.templatePath.updates.text1 && logoTemp.templatePath.updates.text2) {
										logo = newFonts[0].font.getPath(logoTextList[0], 0, 0, constantVars.ORIGINAL_SPACING.logoTextSlider);
										logoTemp.logoPath1 = logo.toSVG();

										logo = null;
										logo = newFonts[0].font.getPath(logoTextList[1], 0, 0, constantVars.ORIGINAL_SPACING.logoTextSlider);
										logoTemp.logoPath2 = logo.toSVG();
										logoTemp.templatePath.isDBLineCompanyText = "yes";
										debugConsole("111111111111111111111111111111");


									} else {
										logo = newFonts[0].font.getPath(logoText, 0, 0, constantVars.ORIGINAL_SPACING.logoTextSlider);
										logoTemp.logoPath = logo.toSVG();
										logoTemp.templatePath.isDBLineCompanyText = "no";
										debugConsole("222222222222222222222222222");
									}
									if (logoTextList.length > 0 && logoTextList.length == 2) {
										logoTemp.splitLogoName = logoTextList[0] + "*" + logoTextList[1];
									}

									debugConsole("template_db_id:=" + logoTemp.templatePath.template_db_id);
									debugConsole("logoTemp.templatePath.text:=" + logoTemp.templatePath.text);
									// return;

									debugConsole("logoTemp.templatePath isEqual:=" + logoTemp.templatePath.isEqual);
									var logoNameLength = 0;
									if (logoTemp.templatePath.isDBLineCompanyText == "yes") {
										logoNameLength = Math.max(logoTextList[0].length, logoTextList[1].length)
									} else {
										logoNameLength = logoText.length;
									}
									var sloganNameLength = sloganText.length;
									debugConsole("logoNameLength:=" + logoNameLength);
									debugConsole("sloganNameLength:=" + sloganNameLength);
									var isEqualCaseSloganLetterSpacing = constantVars.ORIGINAL_SPACING.sloganLetterSpacing;
									logoTemp.templatePath.sloganSetAsPerText = 0;

									var IsEqualCondition = false;
									if (logoTemp.templatePath.isDBLineCompanyText == "yes") {
										if (logoTemp.templatePath.isEqual == 1 && sloganText && (sloganText != "") && (sloganNameLength >= 9) && (logoNameLength >= (sloganNameLength)) && (logoNameLength <= 35)) {
											IsEqualCondition = true;
										}
									} else {
										if (logoTemp.templatePath.isEqual == 1 && sloganText && (sloganText != "") && (sloganText.length >= 9) && (logoText.length >= sloganText.length) && (logoText.length <= 35)) {
											IsEqualCondition = true;
										}
									}

									if (IsEqualCondition) {
										if (logoNameLength >= sloganNameLength) {
											if (sloganNameLength >= 20) {
												isEqualCaseSloganLetterSpacing = (sloganNameLength + logoNameLength) / 2;
											} else {
												isEqualCaseSloganLetterSpacing = (sloganNameLength + logoNameLength);
											}
											logoTemp.sloganLetterSpacing = isEqualCaseSloganLetterSpacing;
											logoTemp.templatePath.sloganSetAsPerText = 1;
										} else if (sloganNameLength >= logoNameLength) {
											if (sloganNameLength / 2 < logoNameLength) {
												isEqualCaseSloganLetterSpacing = (sloganNameLength + logoNameLength);
												logoTemp.sloganLetterSpacing = isEqualCaseSloganLetterSpacing;
												logoTemp.templatePath.sloganSetAsPerText = 1;
											}
										}
									}
									debugConsole("slogan letter spacing:=" + isEqualCaseSloganLetterSpacing);
									if (sloganText && sloganText != "") {
										var slogan = newFonts[1].font.getPath(sloganText, 0, 0, constantVars.ORIGINAL_SPACING.sloganTextSize, { 'letterSpacing': parseFloat(isEqualCaseSloganLetterSpacing) });
										sloganFont = newFonts[1].font;
										logoTemp.sloganPath = slogan.toSVG()
									}
									var monoPath = newFonts[2].font.getPath(monoText, 0, 0, constantVars.ORIGINAL_SPACING.monogramTextSize);
									monoFont = newFonts[2].font;
									let templateIsFrame = false;
									logoTemp.templatePath.frame_width = "";
									logoTemp.templatePath.frame_height = "";
									logoTemp.templatePath.frameShapeName = "";
									logoTemp.templatePath.frmId = "";
									if (logoTemp.templatePath.isFrame == 1) {
										logoTemp.framePath = frames[v[1]].svg;
										logoTemp.templatePath.frameType = frames[v[1]].type;
										logoTemp.templatePath.frameOverlap = frames[v[1]].isOverlap;
										if (frames[v[1]].frame_width) logoTemp.templatePath.frame_width = frames[v[1]].frame_width;
										if (frames[v[1]].frame_height) logoTemp.templatePath.frame_height = frames[v[1]].frame_height;
										if (frames[v[1]].shape) logoTemp.templatePath.frameShapeName = frames[v[1]].shape;
										templateIsFrame = true;
										logoTemp.templatePath.frmId = frames[v[1]].id;
									} else {
										logoTemp.framePath = "";
										logoTemp.templatePath.frameType = "";
										logoTemp.templatePath.frameOverlap = "";
									}
									let templateIsIconFrame = false;
									if (logoTemp.templatePath.isIconFrame == 1) {
										logoTemp.iconFramePath = iconFrames[v[6]].svg;
										templateIsIconFrame = true;
									} else {
										logoTemp.iconFramePath = "";
									}
									let templateIsMono = false;
									var searchIconsId = "";
									if (typeof logoTemp.templatePath.isMono != "undefined" && logoTemp.templatePath.isMono == 1) {

										logoTemp.iconPath = monoPath.toSVG();
										templateIsMono = true;

									} else if (logoTemp.templatePath.isIcon == 1) {
										logoTemp.iconPath = icons[v[2]];
										searchIconsId = iconsId[v[2]];
									} else {
										logoTemp.iconPath = "";
									}
									logoTemp.templateType = v[3];
									logoTemp.bgColor = pellets[v[4]].bg_color;
									logoTemp.mainTextColor = "";
									logoTemp.mainText2Color = "";
									logoTemp.sloganTextColor = "";
									logoTemp.iconColor = "";
									logoTemp.frameColor = "";
									logoTemp.frameFilledColor = "";
									logoTemp.textGradient = "";
									logoTemp.text2Gradient = "";
									logoTemp.sloganGradient = "";
									logoTemp.iconGradient = "";
									logoTemp.frameGradient = "";
									logoTemp.frameFilledGradient = "";
									logoTemp.iconFrameColor = "";
									logoTemp.iconFrameGradient = "";
									var idKey = logoMakerFunction.genRandomId();

									if (gradientsArray[pellets[v[4]].text_color]) {
										logoTemp.textGradient = pellets[v[4]].text_color;
										if (logoTemp.templatePath.isDBLineCompanyText == "yes") {
											logoTemp.text2Gradient = pellets[v[4]].text_color;
										}
									}
									else {
										logoTemp.mainTextColor = pellets[v[4]].text_color;
										if (logoTemp.templatePath.isDBLineCompanyText == "yes") {
											logoTemp.mainText2Color = pellets[v[4]].text_color;
										}
									}

									if (gradientsArray[pellets[v[4]].slogan_color]) {
										logoTemp.sloganGradient = pellets[v[4]].slogan_color;
									}
									else {
										logoTemp.sloganTextColor = pellets[v[4]].slogan_color;
									}

									if (gradientsArray[pellets[v[4]].icon_color]) {
										logoTemp.iconGradient = pellets[v[4]].icon_color;
									}
									else {
										logoTemp.iconColor = pellets[v[4]].icon_color;
									}

									if (gradientsArray[pellets[v[4]].frame_color]) {
										logoTemp.frameGradient = pellets[v[4]].frame_color;
										logoTemp.iconFrameGradient = pellets[v[4]].frame_color;
									}
									else {
										logoTemp.frameColor = pellets[v[4]].frame_color;
										logoTemp.iconFrameColor = pellets[v[4]].frame_color;
									}

									if (gradientsArray[pellets[v[4]].filled_frame_color]) {
										logoTemp.frameFilledGradient = pellets[v[4]].filled_frame_color;
									}
									else {
										logoTemp.frameFilledColor = pellets[v[4]].filled_frame_color;
									}

									logoTemp.idKey = idKey;
									logoTemp.fontName = monoFonts[v[7]].link;
									logoTemp.sloganFontType = sloganFonts[v[5]].link;
									// debugConsole("fonts[v[0]].link:=" + fonts[v[0]].link);
									logoTemp.textFontType = fonts[v[0]].link;
									logoTemp.text2FontType = fonts[v[0]].link;
									logoTemp.sloganFontObject = sloganFont;
									debugConsole("frames[v[1]].id:=" + frames[v[1]].id + ",,,," + templateIsFrame);
									returnObj = logoMakerFunction.generateLogoTemplate(logoTemp, idKey, null, null, null, false, "");
									debugConsole("===============================================");
									logoTemp = returnObj.logoObj;
									logoTemp.sloganFontObject = "";
									var dObj = {};
									logoTemp.monogram = obj.getSession('monogram');
									dObj.generate = logoTemp;
									dObj.logoName = obj.getSession('logoname');
									if (logoTemp.templatePath.isDBLineCompanyText == "yes" && logoTextList.length > 0 && logoTextList.length == 2) {
										dObj.logoName1 = logoTextList[0];
										dObj.logoName2 = logoTextList[1];
									}
									dObj.budgetType = obj.getSession('budgetType');
									dObj.budgetId = obj.getSession('budgetId');
									dObj.budgetVal = obj.getSession('budgetVal');
									dObj.sloganName = obj.getSession('sloganText');
									dObj.industryId = obj.getSession('industryId');
									dObj.industryName = obj.getSession('extraIndustry');
									dObj.currencyId = obj.getSession('currencyId');
									dObj.idKey = idKey;
									dObj.sfId = sloganFonts[v[5]].id;
									dObj.fId = fonts[v[0]].id;
									dObj.frmId = templateIsFrame ? frames[v[1]].id : "";
									dObj.cpId = pellets[v[4]].color_id;
									dObj.iconFrameId = templateIsIconFrame ? iconFrames[v[1]].id : "";
									dObj.monofId = templateIsMono ? monoFonts[v[0]].id : "";
									dObj.generate.sloganLetterSpacing = isEqualCaseSloganLetterSpacing;
									if (searchIconsId != "") {
										dObj.iconId = iconsId[v[2]];
									}
									dObj = updateCurrLogoObject(dObj);

									var templateHint = showLogoAdminIds(logoTemp.templatePath, sloganText, fonts[v[0]].id, pellets[v[4]].color_id, sloganFonts[v[5]].id, frames[v[1]].id, iconFrames[v[1]].id, monoFonts[v[0]].id);

									debugConsole("dynamicLogoCounter:=" + dynamicLogoCounter);
									if ((i + 1) == pellets.length && pellets.length % 2 == 1) {
									} else {
										if (version == "v6") {
											var previewStyle = "pointer-events:auto";
											if (!isLoadMoreClick) {
												previewStyle = "pointer-events:none";

											}
											// solved iPhone step6 issue
											slickElement = '<div class="logos--boxes" data-sfId ="' + sloganFonts[v[5]].id + '" data-fId ="' + fonts[v[0]].id + '" data-frmId ="' + frames[v[1]].id + '" data-cpId ="' + pellets[v[4]].color_id + '" data-cpId ="' + pellets[v[4]].color_id + '"><div class="logo--slides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="preview--btn overlay-preview" style=' + previewStyle + '></div><div class="logo-favourite iconFav" data-toggle="tooltip" title="Add to favorites" data-type="favorite" data-id="' + dynamicLogoCounter + '" data-logo-id="0"><i class="icon icon-heart"></i></div><div><div class="icons-edit icons-preview iconEdit" data-id="' + dynamicLogoCounter + '" data-type="edit" data-logo-id="0"><span class="preview--btn" style=' + previewStyle + '>Preview logo</span><span class="edit--btn">Edit logo</span></div></div></div><div><div class="svg--slide" style="background-color:' + logoTemp.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + logoMakerFunction.getFinalLogoTemplate(dObj.generate) + '</div></div></div></div>';

										} else {
											slickElement = '<div class="logos--boxes" data-sfId ="' + sloganFonts[v[5]].id + '" data-fId ="' + fonts[v[0]].id + '" data-frmId ="' + frames[v[1]].id + '" data-cpId ="' + pellets[v[4]].color_id + '" data-cpId ="' + pellets[v[4]].color_id + '"><div class="logo--slides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="logo-favourite iconFav" data-toggle="tooltip" title="Add to favorites" data-type="favorite" data-id="' + dynamicLogoCounter + '" data-logo-id="0"><i class="icon icon-heart"></i></div><div class="logoSlide-overlay gradient-div"><div class="icons-edit icons-preview iconEdit edit--btn" data-id="' + dynamicLogoCounter + '" data-type="edit" data-logo-id="0"><span class="edit--btn">Edit logo<span class="edit--btn"></span></span></div></div><div class="svg--slide" style="background-color:' + logoTemp.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + logoMakerFunction.getFinalLogoTemplate(dObj.generate) + '</div></div></div></div>';
										}
										// $(".slider--container .icons-preview").css({ "width": "30%", "padding": "22px 10px 10px 30px", "left": "185px", "top": "82%", "border-radius": "unset" });
										$(".sliderContainer").append(slickElement);
									}
									// obj.logoTempArr[j++] = dObj;
									obj.logoTempArr.push(dObj);
									dynamicLogoCounter++;
									i++;
									if (i == pellets.length) {

										//$(".sliderContainer").append('<div class="load--more--class loadMoreFixed"><div class="load--more--button"><a class="loadMoreGenerate generate-button changes-button" href="javascript:;"><span class="load--more-shadow"><span class="final--loader loadMoreLogosBoxes" style="display:none;"><img src="' + DH.getAssetImgUrl('logo-maker/loading.gif') + '" /></span><span class="loader-content">Load More Logos</span></span></a></div></div> ');
									}
									// loaderHide();
									dh_utility_common.changeBg();
									success();
								});
							}));
						});
						debugConsole("randomSlideArray:=" + randomSlideArray.length);
						Promise.all(randomSlideArray).then(() => {
							$('.step_6 .load-more-anim').removeClass('hidden');
							$('.step_6 .load-more-anim').removeClass('fixed');
							$('.step_6 .load-more-anim .loadMoreGenerate').removeClass('animate');
							$('.step_6 .load-more-anim').removeClass('loading');
							$('.ste-6-strip-apply').removeClass('active');
							$('.loadMoreGenerate').removeClass('activating');
							if (p_fCallBack) {
								p_fCallBack();
							}

							debugConsole("aayyaa");
						})
					}
				});
			});
		},
			/* -------------------------------------------------------------------------------------------- */
			// for update monogram text
			obj.setMonogramText = function (monogram) {
				obj.setSession('monogram', monogram);
			}

		// for getting monogram text
		obj.getMonogramText = function (p_bCheckSession) {
			debugConsole("getMonogramText");
			if (p_bCheckSession) {
				var sessionMonogGram = lEditor.getSession("monogram");
				if (sessionMonogGram) {
					return sessionMonogGram;
				}
			}
			var logoText = obj.getSession('logoname');
			return logoMakerFunction.genMonoGramText(logoText);
		}
		/* -------------------------------------------------------------------------------------------- */

		// for getting dynamic logo variation in Editor section 
		obj.generateDynamicLogoVariations = function (p_fCallBack) {
			debugConsole("generateDynamicLogoVariations");
			var sloganFont;
			loadMoreStart++;
			randomPagination++;
			var dObj = getValidJsonParseObj(lEditor.getSession('currentLogo'));
			var limit = 10;
			if (loadMoreStart == 1) {
				randomPagination = loadMoreStart;
				lEditor.logoTempArr = [];
				lEditor.logoSlider('final', 1);
				// $(".editLogoSlider .loadMoreIcons").css({ top: '60%', left: '0%' });
				// $(".editLogoSlider .loadMoreIcons").show();

				if ($('.iconBlank').length) {
					$('.iconBlank').hide().remove();
				}
				$('.finalogoSlider').append('<div class="icons-blank result-option iconBlank">' + whileSearchingSymbol + '</div>');
			}
			var templateIdStyle = getTempStyle();

			obj.getSliderDataIcons(function () {
				debugConsole("getSliderDataIcons");
				if (obj.sliderData.icons.length == 0 && dObj.generate.iconPath != "") {
					obj.sliderData.icons.push(dObj.generate.iconPath);
					if (obj.sliderData.iconsId.length == 0 && dObj.iconId != "" && dObj.iconId) {
						obj.sliderData.iconsId.push(dObj.iconId);
					}
				}
				var sessionColors = [];
				var fonts = [];
				var monoFonts = [];
				var sloganFonts = [];
				var frames = [];
				var iconFrames = [];
				var pellets;
				jqXHR = $.ajax({

					url: DH.baseURL + '/logoMakerAjax.php',
					type: 'POST',
					data: { action: 'randomData', colors: sessionColors, start: randomPagination },
					//async: false,
					success: function (json) {
						var json = getValidJsonParseObj(json);
						$.each(json.data.logoFonts, function (k, v) {
							fonts.push(v);
						});
						$.each(json.data.sloganFonts, function (k, v) {
							sloganFonts.push(v);
						});
						$.each(json.data.monoFonts, function (k, v) {
							monoFonts.push(v);
						});
						$.each(json.data.frames, function (k, v) {
							frames.push(v);
						});
						$.each(json.data.iconFrames, function (k, v) {
							iconFrames.push(v);
						});
						pellets = json.data.pellets;

						if (pellets.length < 10) {
							randomPagination = 0;
							if (pellets.length == 0) {
								obj.generateDynamicLogoVariations();
							}
						}

						// var generationLength = fonts.length;
						// $('.load--more--class').remove();
						var currLogo = getValidJsonParseObj(lEditor.getSession('currentLogo'));
						var splitLogoName = currLogo.generate.splitLogoName;
						debugConsole("splitLogoName:=" + splitLogoName);
						var logoText = obj.getSession('logoname');

						var logoTextList;
						if (splitLogoName && currLogo.logoName1 && currLogo.logoName2) {
							logoTextList = obj.getLogoTextList(splitLogoName);
						} else {
							splitLogoName = currLogo.logoName;
							logoTextList = obj.getLogoTextList(currLogo.logoName);
						}
						var templates = [];
						var icons = obj.sliderData.icons;
						debugConsole("icons.length:=" + icons.length);

						debugConsole("currLogo.generate.templatePath.isIcon:=" + currLogo.generate.templatePath.isIcon);
						debugConsole("currLogo.generate.templatePath.isMono:=" + currLogo.generate.templatePath.isMono);
						var iconsId = obj.sliderData.iconsId;
						var isIconTemplate = 0;
						debugConsole("iconsId:=" + iconsId.length);
						if (iconsId.length > 0) {
							$.each(icons, function (keee, veee) {
								if (veee != "") {
									isIconTemplate = 1;
								}
							});
						}


						debugConsole("isIconTemplate:=" + isIconTemplate)
						if (obj.sliderData.templates.length == 1) {
							templates = obj.sliderData.templates;
						} else {
							if (icons.length == 0 || isIconTemplate == 0) {
								$.each(obj.sliderData.templates, function (k, v) {
									if (v.isIcon == 0) {
										if (v.template_db_id == v.template_id) {
											templates.push(v);
										} else {
											if (logoTextList.length > 0 && logoTextList.length == 2 && (v.template_db_id == v.template_id + ".1")) {
												templates.push(v);
											}
										}
									}
								});

							} else {
								if (logoTextList.length > 0 && logoTextList.length == 2) {
									templates = obj.sliderData.templates;
								} else {
									$.each(obj.sliderData.templates, function (k, v) {
										if (v.template_db_id == v.template_id) {
											templates.push(v);
										}
									});
								}
							}
						}

						debugConsole("obj.sliderData.templates:=" + obj.sliderData.templates.length)
						var monoText = lEditor.getMonogramText(true);
						var sloganText = obj.getSession('sloganText');
						var slides = [];
						var arr = [];
						arr[0] = fonts.length; // text
						arr[1] = frames.length;
						arr[2] = icons.length;
						arr[3] = templates.length;
						arr[4] = pellets.length;
						arr[5] = sloganFonts.length;
						arr[6] = iconFrames.length;
						arr[7] = monoFonts.length;

						obj.randomSliderSet = [];
						var monoTemplate = 0;

						if (templates.length == 1) {
							for (i = 0; i < pellets.length; i++) {
								var comb = logoMakerFunction.getRandomCombination(arr);
								if (logoMakerFunction.isUniqueComination(obj.randomSliderSet, comb)) {
									obj.randomSliderSet.push(comb);
								}
							}
						} else {
							//--------
							for (i = 0; i < pellets.length; i++) {
								isCond = true;
								while (isCond) {
									var comb = logoMakerFunction.getRandomCombination(arr);
									// debugConsole("comb:=" + comb);
									if (logoMakerFunction.isUniqueComination(obj.randomSliderSet, comb)) {
										debugConsole("monoTemplate;=" + monoTemplate);
										// if (monoTemplate < 2) {
										debugConsole("templates[comb[3]].isMono:=" + templates[comb[3]] + ",,,," + comb[3] + ",,,," + templates.length);
										if (templates[comb[3]].isMono == 1) {
											obj.randomSliderSet.push(comb);
											isCond = false;
											monoTemplate++;
										} else {
											if (templates[comb[3]].isMono == 0) {
												// debugConsole("continue continue");
												obj.randomSliderSet.push(comb);
												isCond = false;
											}
											// continue;
										}
										// } else {
										// 	if (templates[comb[3]].isMono == 0) {
										// 		obj.randomSliderSet.push(comb);
										// 		isCond = false;
										// 	}
										// }

									}
								}
							}

						}


						var i = 0;
						obj.randomSliderSet = obj.randomSliderSet.map((a) => ({ sort: Math.random(), value: a })).sort((a, b) => a.sort - b.sort).map((a) => a.value);
						var randomObjLength = obj.randomSliderSet.length;
						var fontLoader = 0;

						var j = parseInt((loadMoreStart - 1) * limit);
						debugConsole("j:=" + j);
						var randomSlideArray = [];
						debugConsole("obj.randomSliderSet:=" + obj.randomSliderSet.length);
						$.each(obj.randomSliderSet, function (k, v) {
							randomSlideArray.push(new Promise((success, failure) => {
								var monoPath = "";
								v[0] = fontLoader++;
								var logoTemp = {
									logoPath: "",
									logoPath1: "",
									logoPath2: "",
									sloganPath: "",
									framePath: "",
									iconFramePath: "",
									iconPath: "",
									templatePath: "",
									bgColor: "",
								};

								var promiseArr = [];

								promiseArr.push(new Promise((resolve, reject) => {
									if (fonts[v[0]].link == "" && DH.DH_APP_MODE == 'DEVELOPMENT') {
										alert("Please disabled this font id " + fonts[v[0]].id + "in local admintest");
									}
									opentype.load(fonts[v[0]].link, function (err, font) {
										resolve(font);
									});
								}));
								promiseArr.push(new Promise((resolve, reject) => {
									opentype.load(sloganFonts[v[5]].link, function (err, font) {
										resolve(font);
									});

								}));
								promiseArr.push(new Promise((resolve, reject) => {
									debugConsole("333333333");
									opentype.load(monoFonts[v[7]].link, function (err, font) {
										resolve(font);
									});

								}));

								debugConsole("promiseArr:=" + promiseArr.length + ",,,,kkkk:=" + k + ",,,," + v.length + ",,,fontLoader:=" + fontLoader);


								Promise.all(promiseArr).then(newFonts => {
									var logo = null;
									logoTemp.templatePath = templates[v[3]];

									if (logoTextList.length == 2 && logoTemp.templatePath.text1 && logoTemp.templatePath.text2 && logoTemp.templatePath.updates.text1 && logoTemp.templatePath.updates.text2) {
										logo = newFonts[0].getPath(logoTextList[0], 0, 0, constantVars.ORIGINAL_SPACING.logoTextSlider);
										logoTemp.logoPath1 = logo.toSVG();

										logo = null;
										logo = newFonts[0].getPath(logoTextList[1], 0, 0, constantVars.ORIGINAL_SPACING.logoTextSlider);
										logoTemp.logoPath2 = logo.toSVG();
										logoTemp.templatePath.isDBLineCompanyText = "yes";
										logoTemp.splitLogoName = splitLogoName;

									} else {
										if (logoText != '' && newFonts[0]) {
											logo = newFonts[0].getPath(logoText, 0, 0, constantVars.ORIGINAL_SPACING.logoTextSlider);
											logoTemp.logoPath = logo.toSVG();
										}
										else {
											logoTemp.logoPath = '<path d="M 0 0 l 1 0" stroke="white" stroke-width="0" fill ="none" />';
										}
										logoTemp.templatePath.isDBLineCompanyText = "no";
										logoTemp.splitLogoName = "";

									}
									// if (logoTextList.length > 0 && logoTextList.length == 2) {

									// }else{
									// 	logoTemp.splitLogoName = "";
									// }


									var slogan = newFonts[1].getPath(sloganText, 0, 0, constantVars.ORIGINAL_SPACING.sloganTextSize);
									var monoPath = newFonts[2].getPath(monoText, 0, 0, constantVars.ORIGINAL_SPACING.monogramTextSize);

									//logoTemp.logoPath = logo.toSVG();
									sloganFont = newFonts[1];

									logoTemp.sloganPath = slogan.toSVG()
									monoFont = newFonts[2];

									let templateIsFrame = false;
									if (logoTemp.templatePath.isFrame == 1) {
										logoTemp.framePath = frames[v[1]].svg;
										logoTemp.templatePath.frameType = frames[v[1]].type;
										logoTemp.templatePath.frameOverlap = frames[v[1]].isOverlap;
										logoTemp.templatePath.frame_width = frames[v[1]].frame_width;
										logoTemp.templatePath.frame_height = frames[v[1]].frame_height;
										logoTemp.templatePath.frameShapeName = frames[v[1]].shape;
										logoTemp.templatePath.frmId = frames[v[1]].id;
										templateIsFrame = true;
									} else {
										logoTemp.framePath = "";
										logoTemp.templatePath.frameType = "";
										logoTemp.templatePath.frameOverlap = "";
										logoTemp.templatePath.frame_width = "";
										logoTemp.templatePath.frame_height = "";
										logoTemp.templatePath.frameShapeName = "";
										logoTemp.templatePath.frmId = "";
									}
									let templateIsIconFrame = false;
									if (logoTemp.templatePath.isIconFrame == 1) {
										logoTemp.iconFramePath = iconFrames[v[6]].svg;
										templateIsIconFrame = true;
									} else {
										logoTemp.iconFramePath = "";
									}
									let templateIsMono = false;
									var searchIconsId = "";
									if (typeof logoTemp.templatePath.isMono != "undefined" && logoTemp.templatePath.isMono == 1) {

										logoTemp.iconPath = monoPath.toSVG();
										templateIsMono = true;

									} else if (logoTemp.templatePath.isIcon == 1) {
										logoTemp.iconPath = icons[v[2]];
										searchIconsId = iconsId[v[2]];
									} else {
										logoTemp.iconPath = "";
									}
									logoTemp.templateType = v[3];
									debugConsole("logoTemp.templatePath template_id:=" + logoTemp.templatePath.template_id);
									debugConsole("logoTemp.templatePath isEqual:=" + logoTemp.templatePath.isEqual);
									if (logoMakerFunction.checkTemplateIsEqualCondition(logoTemp)) {
										logoTemp.templatePath.sloganSetAsPerText = 1;
									} else {
										logoTemp.templatePath.sloganSetAsPerText = 0;
									}
									logoTemp.bgColor = pellets[v[4]].bg_color;
									logoTemp.mainTextColor = "";
									logoTemp.mainText2Color = "";
									logoTemp.sloganTextColor = "";
									logoTemp.iconColor = "";
									logoTemp.frameColor = "";
									logoTemp.frameFilledColor = "";
									logoTemp.textGradient = "";
									logoTemp.text2Gradient = "";
									logoTemp.sloganGradient = "";
									logoTemp.iconGradient = "";
									logoTemp.frameGradient = "";
									logoTemp.frameFilledGradient = "";
									logoTemp.iconFrameColor = "";
									logoTemp.iconFrameGradient = "";
									var idKey = logoMakerFunction.genRandomId();

									if (gradientsArray[pellets[v[4]].text_color]) {
										logoTemp.textGradient = pellets[v[4]].text_color;
										logoTemp.text2Gradient = pellets[v[4]].text_color;
									}
									else {
										logoTemp.mainTextColor = pellets[v[4]].text_color;
										if (logoTemp.templatePath.isDBLineCompanyText == "yes") {
											logoTemp.mainText2Color = pellets[v[4]].text_color;
										}
									}

									if (gradientsArray[pellets[v[4]].slogan_color]) {
										logoTemp.sloganGradient = pellets[v[4]].slogan_color;
									}
									else {
										logoTemp.sloganTextColor = pellets[v[4]].slogan_color;
									}

									if (gradientsArray[pellets[v[4]].icon_color]) {
										logoTemp.iconGradient = pellets[v[4]].icon_color;
									}
									else {
										logoTemp.iconColor = pellets[v[4]].icon_color;
									}

									if (gradientsArray[pellets[v[4]].frame_color]) {
										logoTemp.frameGradient = pellets[v[4]].frame_color;
										logoTemp.iconFrameGradient = pellets[v[4]].frame_color;
									}
									else {
										logoTemp.frameColor = pellets[v[4]].frame_color;
										logoTemp.iconFrameColor = pellets[v[4]].frame_color;
									}

									if (gradientsArray[pellets[v[4]].filled_frame_color]) {
										logoTemp.frameFilledGradient = pellets[v[4]].filled_frame_color;
									}
									else {
										logoTemp.frameFilledColor = pellets[v[4]].filled_frame_color;
									}

									logoTemp.idKey = idKey;

									logoTemp.fontName = monoFonts[v[7]].link;
									logoTemp.sloganFontType = sloganFonts[v[5]].link;
									logoTemp.textFontType = fonts[v[0]].link;
									logoTemp.text2FontType = fonts[v[0]].link;
									logoTemp.sloganFontObject = sloganFont;
									returnObj = logoMakerFunction.generateLogoTemplate(logoTemp, idKey, constantVars.ORIGINAL_SPACING.logoTextSlider, constantVars.ORIGINAL_SPACING.logoLetterSpacing, null, true, "dynamicLogoVariations");
									logoTemp = returnObj.logoObj;
									logoTemp.sloganFontObject = "";

									dObj.generate = logoTemp;
									dObj.logoName = obj.getSession('logoname');
									if (logoTemp.templatePath.isDBLineCompanyText == "yes" && logoTextList.length > 0 && logoTextList.length == 2) {
										dObj.logoName1 = logoTextList[0];
										dObj.logoName2 = logoTextList[1];
									} else {
										dObj.logoName1 = "";
										dObj.logoName2 = "";
									}
									dObj.budgetType = obj.getSession('budgetType');
									dObj.budgetId = obj.getSession('budgetId');
									dObj.budgetVal = obj.getSession('budgetVal');
									dObj.sloganName = obj.getSession('sloganText');
									dObj.industryId = obj.getSession('industryId');
									dObj.industryName = obj.getSession('extraIndustry');
									dObj.currencyId = obj.getSession('currencyId');

									dObj.sfId = sloganFonts[v[5]].id;
									dObj.fId = fonts[v[0]].id;
									debugConsole("templateIsFrame:=" + templateIsFrame);
									dObj.frmId = templateIsFrame ? frames[v[1]].id : "";
									dObj.cpId = pellets[v[4]].color_id;
									dObj.iconFrameId = templateIsIconFrame ? iconFrames[v[1]].id : "";
									dObj.monofId = templateIsMono ? monoFonts[v[0]].id : "";
									if (searchIconsId != "") {
										dObj.iconId = searchIconsId;
									}
									dObj = updateCurrLogoObject(dObj);
									debugConsole("i:=" + i);
									debugConsole("pellets.length:=" + pellets.length);
									if ((i + 1) == pellets.length && pellets.length % 2 == 1) {
										debugConsole("nothing");
									} else {

										var templateHint = showLogoAdminIds(logoTemp.templatePath, sloganText, fonts[v[0]].id, pellets[v[4]].color_id, sloganFonts[v[5]].id, frames[v[1]].id, iconFrames[v[1]].id, monoFonts[v[0]].id);

										slickElement = '<div class="logos--boxes" data-sfId ="' + sloganFonts[v[5]].id + '" data-fId ="' + fonts[v[0]].id + '" data-frmId ="' + frames[v[1]].id + '" data-cpId ="' + pellets[v[4]].color_id + '" data-cpId ="' + pellets[v[4]].color_id + '"><div class="logo--slides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="logoSlide-overlay gradient-div"><a href="javascript:;" class="icons-edit icons-update setDefaultLogo"  data-id="' + (j) + '"><span>Update to this</span></a></div><div class="svg--slide" style="background-color:' + logoTemp.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + logoMakerFunction.getFinalLogoTemplate(dObj.generate) + '</div></div></div></div>';


										$(".finalogoSlider").append(slickElement);
									}
									obj.logoTempArr[j++] = getValidJsonParseObj(getValidJsonStringifyObj(dObj));

									i++;

									debugConsole("obj.logoTempArr:=" + obj.logoTempArr);
									debugConsole("i:=" + i + ",,,," + j);
									if (i == pellets.length) {
										if ($('.load--more--class').length) {
											$('.load--more--class').remove();
										}
										$(".finalogoSlider").append('<div class="load--more--class"><a class="loadMoreDynamicGenerate load--more--button" href="javascript:;"><span class="load--more-shadow"><span class="final--loader loadMoreLogosBoxes" style="display:none;"><img src="' + DH.getAssetImgUrl('logo-maker/loading.svg') + '" /></span>Load More Logos</span></a></div> ');
										if (p_fCallBack) {
											p_fCallBack();
										}
									}
									if (i == 1) {
										if ($('.iconBlank').length) {
											$('.iconBlank').hide().remove();
										}
										if ($('.load--more--class').length) {
											$('.load--more--class').remove();
										}
									}
									// loaderHide();
									dh_utility_common.changeBg();
									if (p_fCallBack) {
										p_fCallBack();
									}
								});
							}));
						});
					}
				});
			});
		},
			/* --------------------------------------------------------------------------------------------------- */
			// for updating font object for company name and slogan name 
			obj.updateFontsObject = function (type, p_oobj = null) {
				debugConsole("updateFontsObject:-" + type);
				return new Promise((resolve, reject) => {
					switch (type) {
						case "logo":
							if (p_oobj) {
								debugConsole("updateFontsObject for :=" + type + ",,," + p_oobj.textFontType);
								opentype.load(p_oobj.textFontType, function (err, font) {
									currCompFontObject = font;
									resolve();
								});
							} else {
								opentype.load(obj.currentLogo.generate.textFontType, function (err, font) {
									currCompFontObject = font;
									resolve();
								});
							}
							break;
						case "logoName2":
							if (p_oobj) {
								// debugConsole("updateFontsObject for :=" + type + ",,," + p_oobj.text2FontType);
								if (p_oobj.text2FontType && (p_oobj.text2FontType != "")) {
									opentype.load(p_oobj.text2FontType, function (err, font) {
										currCompFont2Object = font;
										resolve();
									});
								} else {
									resolve();
								}
							} else {
								// debugConsole("obj.currentLogo.generate.text2FontType:=" + obj.currentLogo.generate.text2FontType);
								if (obj.currentLogo.generate.text2FontType && (obj.currentLogo.generate.text2FontType != "")) {
									opentype.load(obj.currentLogo.generate.text2FontType, function (err, font) {
										currCompFont2Object = font;
										resolve();
									});
								} else {
									resolve();
								}
							}
							break;
						case "slogan":
							if (p_oobj) {
								debugConsole("updateFontsObject for :=" + type + ",,," + p_oobj.sloganFontType);
								opentype.load(p_oobj.sloganFontType, function (err, font) {
									currSloganFontObject = font;
									resolve();
								});
							} else {
								opentype.load(obj.currentLogo.generate.sloganFontType, function (err, fnt) {
									currSloganFontObject = fnt;
									resolve();
								});
							}
							break;
						case "mono":
							if (p_oobj) {
								debugConsole("updateFontsObject for :=" + type + ",,," + p_oobj.fontName);
								opentype.load(p_oobj.fontName, function (err, font) {
									currMonogramFontObject = font;
									resolve();
								});
							} else {
								opentype.load(obj.currentLogo.generate.fontName, function (err, monofont) {
									currMonogramFontObject = monofont;
									resolve();
								});
							}
							break;
					}

				});
			}

		/* Current Steps Cases */

		obj.showStep = function () {
			debugConsole('---Fn showStep called ---');
			if (typeof DH != 'undefined' && typeof DH.isLogged != 'undefined' && parseInt(DH.isLogged) > 0) {
				$('.step-holder').addClass('loggedin');
			}
			var anim;
			if (obj.getSession('currPage') === null || obj.getSession('currPage') === "null" || obj.getSession('currPage') === "" || obj.getSession('currPage') === "undefined") {
				this.currentStep = 2;
			} else {
				this.currentStep = obj.getSession('currPage');
			}
			this.currentStep = parseInt(this.currentStep);
			currPage = parseInt(this.currentStep);

			$('.getStarted').removeClass('c-1 c-2 c-3 c-4');
			$('.btnSkip').removeClass('skip-synmbols skip-visulcolor');
			$(".step-holder").addClass('hidden');
			$(".step_" + currPage).removeClass('hidden');
			$(".backButton").attr("data-link", "");
			debugConsole("showStep currPage:=" + currPage);

			if ($("body").hasClass('fullheight')) {
				$("body").css("overflow", "auto");
				$("body").removeClass('fullheight');
			}
			switch (currPage) {
				case 1: {
				}
				case 2: {
					$('.init-focus').focus();
					$('.footer-strip, .top--buttons, .startButton,  .topRightButtons, .lEditorHeader,.loginOption').removeClass('hidden');
					$('.footer-strip-content .btn-white, .topLeftButtons, .topActionBtn, .buyNowBtn, .downloadFilesBtn').addClass('hidden');
					var getSampleImage = getValidJsonParseObj(obj.getSession('sampleImage'));
					var boxLength = 0;
					if (getSampleImage !== null) {
						$.each(getSampleImage, function (k, v) {
							$("[data-sampleid='" + v.sampleid + "']").addClass('active');
							boxLength++;
						});
					}
					obj.progressBar(boxLength);
					$('.getStarted').addClass('c-1');
					break;
				}
				case 3: {
					var boxLength = 0;
					$('.init-focus').focus();
					$('.footer-strip, .backButton, .startButton, .topLeftButtons, .topRightButtons, .lEditorHeader,.loginOption').removeClass('hidden');
					$('.footer-strip-content .progress, .footer-strip-content .btn-green, .topActionBtn, .buyNowBtn, .downloadFilesBtn').addClass('hidden');
					$('.footer-strip-content .btn-white').removeClass('hidden');

					var sampleClr = getValidJsonParseObj(lEditor.getSession('sampleColor'));
					$('.sampleColor_1').removeClass('active');
					if (sampleClr == '' || sampleClr == 'undefined' || sampleClr == null || jQuery.isEmptyObject(sampleClr)) {
						boxLength = 0;
					} else {
						$.each(sampleClr, function (k, v) {
							$("[data-samplecolorid='" + v.samplecolorid + "']").addClass('active');
						});
						boxLength = 1;
					}
					obj.skipBtn(boxLength);
					$('.getStarted').addClass('c-2');
					$('.btnSkip').addClass('skip-visulcolor');
					break;
				}

				case 4: {
					$('.step_4  input:first').focus();
					$('.footer-strip, .backButton, .startButton, .topLeftButtons, .topRightButtons, .lEditorHeader,.loginOption').removeClass('hidden');
					$('.footer-strip-content .progress, .footer-strip-content .btn-white, .topActionBtn, .buyNowBtn, .downloadFilesBtn').addClass('hidden');
					$('.footer-strip-content .btn-green').removeClass('hidden');
					var logoText = removeMultipleSpaces(obj.getSession('logoname'));
					var sloganText = removeMultipleSpaces(obj.getSession('sloganText'));
					var industryName = obj.getSession('industryId');
					var extraIndustry = obj.getSession('extraIndustry');
					var budgetType = obj.getSession('budgetType');
					var budgetId = obj.getSession('budgetId');
					var extraBudget = obj.getSession('budgetVal');
					if (industryName == 2010) {
						$('.extra--industry').show();
						$('.extraIndustry').val(extraIndustry);
					}
					if (obj.budgetShowType == 1) {

						if (budgetType == 2) {
							$('#budgetType').val('custom');
							$('.extra--budget').show();
							$('#extraBudget').val(extraBudget);
						} else {
							$('#budgetType').val(budgetId);
						}
					}

					if (sloganText != null || logoText != null) {
						$('#sloganText').val(sloganText);
						$('#logoname2').val(logoText);
						$('.industryName').val(industryName);
						$('.footer-strip-content .btn-green').removeClass('disable-button');
					}
					$('.getStarted').addClass('c-3');
					break;
				}

				case 5: {
					//debugger;
					sessionStorage.setItem("prevPage", 5);
					if (lottie) {
						lottie.destroy();
					}
					$('.step_5  input:first').focus();
					if ($('#aniBG').length) {
						$('#aniBG').css('display', 'none')
					}
					if ($('#animation_box').length) {
						$('#animation_box').css('display', 'none')
					}
					$('.footer-strip, .backButton, .startButton, .topLeftButtons, .topRightButtons, .lEditorHeader, .loginOption').removeClass('hidden');
					$('.footer-strip-content .progress, .footer-strip-content .btn-green, .topActionBtn, .buyNowBtn, .downloadFilesBtn').addClass('hidden');
					$('.footer-strip-content .btn-white').removeClass('hidden');
					var industryName = obj.getSession('industryId');
					if (version == 'v4' && typeof industryName != 'undefined' && industryName != '') {
						//debugger;
						getRecomIconListing();
						break;
					}
					else {
						//debugger;
						if (obj.indusType == 1) {
							getIconTagListingNew();
							var sampleArr = getValidJsonParseObj(obj.getSession('sampleIcon'));
							var boxLength = 0;
							obj.sampleIconArr = [];
							if (typeof sampleArr != 'undefined' && sampleArr != null) {
								if (sampleArr.si != null && !$.isEmptyObject(sampleArr.si)) {
									obj.sampleIconArr = sampleArr.si;
									boxLength = 1;
								}
							}
						} else {
							//	getIconTagListing();
							getIconTagListingNew();
							var sampleArr = getValidJsonParseObj(obj.getSession('sampleIcon'));
							var boxLength = 0;
							obj.sampleIconArr = [];
							if (typeof sampleArr != 'undefined' && sampleArr != null) {
								if (sampleArr.si != null && !$.isEmptyObject(sampleArr.si)) {
									obj.sampleIconArr = sampleArr.si;
									boxLength = 1;
								}
							}
						}
						obj.iconsData(1);
						obj.addSelectedIcon();
						$('.getStarted').addClass('c-4');
						$('.btnSkip').addClass('skip-synmbols');
						break;
					}
					break;
				}

				case 6: {
					if (lottie) {
						lottie.destroy();
					}
					if (prevPage == 7) {
						if ($('.stripContainer').length > 0) {
							$('.bot-padding').css('padding-bottom', $('.stripContainer').innerHeight() + 'px');
							var extendTime = 7;
							var seconds = new Date().getSeconds();
							var miliseconds = seconds + extendTime * 1000;
							setTimeout(function () {
								strip();
							}, miliseconds);
							function strip() {
								if (($(window).scrollTop() > 100)) {
									$('.stripContainer').fadeIn(200);
								}
								else {
									$(window).scroll(function () {
										if ($(window).scrollTop()) {
											$('.stripContainer').fadeIn(200);
										}
									});
								}
							}
						}
					}
					$('.step_6').css('display', "none");
					loadMoreStart = 0;
					dynamicLogoCounter = 0;


					$('.editCompanyName').val(obj.getSession('logoname'));
					$('.editSloganName').val(obj.getSession('sloganText'));

					obj.activateSelectedColors();
					var sampleArr = getValidJsonParseObj(obj.getSession('sampleIcon'));
					var boxLength = 0;
					obj.sampleIconArr = [];
					if (typeof sampleArr != 'undefined' && sampleArr != null) {
						if (sampleArr.si != null && !$.isEmptyObject(sampleArr.si)) {
							obj.sampleIconArr = sampleArr.si;
							boxLength = 1;
						}
					}
					obj.addSelectedIcon();
					if (showStep6Anm) {
						$('.lEditorHeader').addClass('hide');
						$('.pages-content-top.container-fluid').css('background-color', '#fff');
						if (version == "v6") {
							$("body").css("overflow", "hidden");
						}

						if (prevPage != 7) {

							if (!$('#aniBG').length) {
								var aniBG = document.createElement('div');
								aniBG.id = "aniBG";
								aniBG.style.position = "absolute";
								aniBG.style.height = "100%";
								aniBG.style.width = "100%";
								aniBG.style.backgroundColor = "#ffffff";
								$('.main-body').append(aniBG);
							} else {
								$('#aniBG').css('display', 'block');
								var aniBG = $('#aniBG')[0];
							}
							if (!$('#animation_box').length) {
								var aniDiv = document.createElement('div');
								aniDiv.id = "animation_box";

								aniDiv.style.width = "100%";
								aniDiv.style.paddingTop = "60px";
								$('.main-body').append(aniDiv);


							} else {
								$('#animation_box').css('display', 'block')
								var aniDiv = $('#animation_box')[0];
							}


							var params = {
								container: document.getElementById('animation_box'),
								renderer: 'svg',
								loop: false,
								autoplay: true,
								animationData: animationData,
								rendererSettings: {
									scaleMode: 'noScale'

								}

							};

							anim = lottie.loadAnimation(params);

							anim.onComplete = () => {
								if (version == "v6") $("body").addClass('fullheight');
								$('.step_6').css('display', "block");
								$('.lEditorHeader').removeClass('hide');
								$('.pages-content-top.container-fluid').css('background-color', 'transparent');
								aniDiv.style.display = 'none';
								aniBG.style.display = 'none';
								if ($('.stripContainer').length > 0) {
									$('.bot-padding').css('padding-bottom', $('.stripContainer').innerHeight() + 'px');
									var extendTime = 7;
									var seconds = new Date().getSeconds();
									var miliseconds = seconds + extendTime * 1000;
									setTimeout(function () {
										strip();
									}, miliseconds);
									function strip() {
										if (($(window).scrollTop() > 100)) {
											$('.stripContainer').fadeIn(200);
										}
										else {
											$(window).scroll(function () {
												if ($(window).scrollTop()) {
													$('.stripContainer').fadeIn(200);
												}
											});
										}
									}
								}
								if (DH.isLogged == 0 && DH.userId == 0 && version != "v6") {
									clearTimeout(loginPopupTimer);
									loginPopupTimer = setTimeout(function () {
										userLoginPopup()
									}, 2500);
									document.getElementsByClassName("main-body")[0].removeChild(aniBG);
									document.getElementsByClassName("main-body")[0].removeChild(aniDiv);
									$('body').addClass('logo-modal-unset');
									return;
								} else {
									document.getElementsByClassName("main-body")[0].removeChild(aniBG);
									document.getElementsByClassName("main-body")[0].removeChild(aniDiv);
									if (version == "v6") {
										if (DH.isLogged == 0 && DH.userId == 0) {
											loginPopupTimer = setTimeout(function () {
												userLoginPopup();
												$('body').addClass('logo-modal-unset');
											}, 250);
										}
									}
								}
							}
						} else {
							$('.step_6').css('display', "block");
							if (version == "v6") $("body").addClass('fullheight');
							sessionStorage.setItem("prevPage", 6);
							$('.lEditorHeader').removeClass('hide');
							$('.pages-content-top.container-fluid').css('background-color', 'transparent');
						}
					} else {
						if (version == "v6") {
							$("body").css("overflow", "hidden");
							$("body").addClass('fullheight');
						}
						$('.step_6').css('display', "block");
						sessionStorage.setItem("prevPage", 6);
					}
					step6SelectedLogoSlides = null;
					obj.cleanSession("currentLogo");
					obj.cleanSession("monogram");
					obj.generateDynamicLogos(false, function () {
						debugConsole("donee");
						if (version == "v6") {
							higlightLogoSlides(true, null);
							previewLogoAtStep6(0, true);
							if (!showStep6Anm) {
								if (DH.isLogged == 0 && DH.userId == 0) {
									loginPopupTimer = setTimeout(function () {
										userLoginPopup();
										$('body').addClass('logo-modal-unset');
									}, 300);
								}
							}
						}
					});

					$('.footer-strip, .topActionBtn, .buyNowBtn, .downloadFilesBtn').addClass('hidden');
					$('.backButton, .startButton, .topLeftButtons, .topRightButtons, .lEditorHeader,.loginOption, .favOption').removeClass('hidden');
					break;
				}


				case 7: {
					$('.editMonogramText').val(obj.getMonogramText(true));
					$(".backButton").attr("data-link", sessionStorage.getItem('backLink'));

					var currTargetLink = lEditor.getSession('targetlink');

					debugConsole("currTargetLink:=" + currTargetLink);
					debugConsole("parentlink:=" + lEditor.getSession('parentlink'));

					//currTargetLink:=6
					//parentlink:=2
					if (currTargetLink == 29) {
						currTargetLink = lEditor.setSession('targetlink', 2);
					}

					if ((currTargetLink == 32 || currTargetLink == 39) && lEditor.getSession('parentlink') == 5) {
						lEditor.setSession('targetlink', 2);
						lEditor.setSession('parentlink', 'undefined');
						lEditor.setSession('defaultlink', 0);
					}
					if ((currTargetLink == 5) && lEditor.getSession('parentlink') == "undefined") {
						lEditor.setSession('targetlink', 2);
						lEditor.setSession('parentlink', 'undefined');
						lEditor.setSession('defaultlink', 0);
					}

					if ((currTargetLink == 6) && lEditor.getSession('parentlink') == 2) {
						lEditor.setSession('targetlink', 2);
						lEditor.setSession('parentlink', 'undefined');
						lEditor.setSession('defaultlink', 0);
					}

					if (lEditor.getSession("coming_from") && (lEditor.getSession("coming_from") == "step6_edit")) {
						lEditor.setSession('parentlink', 2);
						lEditor.setSession('targetlink', 7);
						lEditor.setSession('defaultlink', 0);
						lEditor.cleanSession("coming_from");
						// forcefully set when come from step6 
					}

					$('.topActionBtn').css('display', 'inline-block');
					$('.startButton, .topLeftButtons, .topRightButtons, .buyNowBtn, .topActionBtn, .lEditorHeader,.loginOption, .tutorialVid, .tutorBtn, .leditorLogo').removeClass('hidden');
					$('.leditorLogo').addClass('mob')
					$('.favOption, .leditorLogo ~ img').addClass('hidden');
					$('.leditorLogo ~ img').addClass('desktop');
					if (currTargetLink == null || currTargetLink == 'undefined') {
						// currTargetLink = lEditor.setSession('targetlink', 2);
					}

					obj.currentLogo = getValidJsonParseObj(obj.getSession('currentLogo'));
					var sessionFav = getValidJsonParseObj(obj.getSession('favoriteJSON'));

					if (lEditor.getSession('isEditable') == 1) {
						$('.editCompanyName').attr('disabled', true);
						$('.le--buy-now.downloadFilesBtn').removeClass('hidden');
						$('.le--buy-now.buyNowBtn').addClass('hidden');
					}
					else {
						$('.editCompanyName').removeAttr('disabled');
						$('.le--buy-now.buyNowBtn').removeClass('hidden');
						$('.le--buy-now.downloadFilesBtn').addClass('hidden');
					}

					if (sessionFav !== null) {
						favoriteJSON = sessionFav;
					}
					debugConsole("updateFontsObject1");
					obj.updateFontsObject('logo').then(_ => {
						obj.updateFontsObject('logoName2').then(_ => {
							obj.updateFontsObject('slogan').then(_ => {
								return obj.updateFontsObject('mono')
							});
						});
					}).then(_ => {
						if (currTargetLink == 29) {
							obj.setSession('targetlink', 2);
							$('.subMenu-29').parent('li').removeClass('active');
						}
						debugConsole("editLogoSteps1");
						obj.editLogoSteps();

						/* Layout Section Start */

						$('.layoutSection li').each(function () {
							var layoutOption = $(this).find('a').data('option');
							var tmpType = obj.currentLogo.generate.templateType;
							if (layoutOption == tmpType) {
								$('.layoutSection li').removeClass('active');
								$(this).addClass('active');
							}
						});

						/*  Layout Section End */

						/*  container Section Start */


						if (currTargetLink == 24) {
							$('.subMenu-24').trigger('click');
							obj.getCurrentLogo();
						}
						if (currTargetLink == 40) {
							$('.subMenu-40').trigger('click');
							obj.getCurrentLogo();
						}
						if (currTargetLink == 23) {
							$('.containerSection li').removeClass('active');
							$('.editFinalLogo').removeClass('hidden');
							$('.containerOptions').removeClass('active')
							obj.setSession('targetlink', 6);
							obj.getCurrentLogo();
						}


						if (currTargetLink == 42) {
							$('.subMenu-24').trigger('click');
							obj.setSession('targetlink', 6);
							obj.getCurrentLogo();
						}
						if (currTargetLink == 44) {
							$('.subMenu-40').trigger('click');
							obj.setSession('targetlink', 6);
							obj.getCurrentLogo();
						}

						if (currTargetLink == 5) {
							$(".step-holder").addClass('hidden');
							$(".step_" + currPage).removeClass('hidden');

						}

						if (currTargetLink == null || currTargetLink == 'undefined' || currTargetLink == 1) {
							obj.previewColors();
							obj.previewLogo();
						} else {
							//$('.logoImages').html('');
						}

						/* === container Section End ===*/

						/* === Logo Section Start ===*/
						$('.editCompanyName').val(obj.getSession('logoname'));
						// $('.editSloganName').val(obj.getSession('sloganText'));

						/* === Logo Section End ===*/

						obj.getCurrentLogo();


						/****************Update Sliders Value********************/
						$("#templateGenerator").html('');
						var html = logoMakerFunction.getFinalLogoTemplate(obj.currentLogo.generate);
						$("#templateGenerator").html(html);
						/*	if($('#templateGenerator .sampleIcons_1').length > 0){
							constantVars.SPACING.logoSizeSlider = parseInt($('#templateGenerator .sampleIcons_1').get(0).getBBox().width * obj.currentLogo.generate.templatePath.icon.scale * obj.currentLogo.generate.templatePath.containerBody.scale * obj.currentLogo.generate.templatePath.logoContainer.scale);
							lEditor.setSession('logoSizeSlider',constantVars.SPACING.logoSizeSlider);
						}else{
							lEditor.setSession('logoSizeSlider',100);
						}*/
						$("#templateGenerator").html('');
						/**************************************************/
						if (!recentColors.length) {
							loadRecentColors();
						}
					})
					break;
				}


			}

		}


		obj.imgLength = function () {
			currPage = parseInt(this.currentStep);
			return boxLength = $(".step_" + currPage + ' .active').length;
		}

		/* progress bar */
		// progress bar for step 2 
		obj.progressBar = function (boxLength) {
			if (boxLength <= 4) {
				$('.footer-strip-content .progress-bar').css({ 'width': parseInt(boxLength * 20 > 100 ? 100 : boxLength * 20) + '%' });

				$('.footer-strip-content .progress').removeClass('hidden');
				$('.footer-strip-content .btn-green').addClass('hidden').css('float', 'right');
				$('.footer-strip-content .btn-white').addClass('hidden');
				$('.footer-strip-content .progress .progress-style, .footer-strip-content .progress .progress-percentage').removeClass('hidden');
			}
			else {
				$('.footer-strip-content .progress').addClass('hidden');
				$('.footer-strip-content .btn-white').addClass('hidden');
				$('.footer-strip-content .btn-green').removeClass('hidden').css('float', 'none');
			}
			if (boxLength >= 1) {
				$('.progressBarText').text(boxLength + ' of 5').removeClass('hidden');
				$('.footer-strip-content .btn-green').removeClass('hidden');
				$('.footer-strip-content .progress').css('float', 'left');
				$('.footer-strip-content .progress').removeClass('bar-progress');
				$('.footer-strip-content .progress .progress-style, .footer-strip-content .progress .progress-percentage').addClass('hidden');
				$('.footer-strip-content .progress').removeClass('mob-progress');
			} else {
				$('.progressBarText').addClass('hidden').text('');
			}


		}
		/* skip button */

		obj.skipBtn = function (boxLength) {
			//var b = obj.getSession('currPage');
			//debugger;
			if (boxLength > 0) {
				$('.footer-strip-content .btn-white').addClass('hidden');
				$('.footer-strip-content .btn-green').removeClass('hidden');
				if (typeof obj.getSession('currPage') != 'undefined' && obj.getSession('currPage') == '5' && version == 'v4') {
					$('.iconContainerDiv .getStarted').removeClass('hidden');
					$('.iconContainerDiv .btnSkip').addClass('hidden');

				}
			}
			else {
				$('.footer-strip-content .btn-white').removeClass('hidden');
				$('.footer-strip-content .btn-green').addClass('hidden');
				if (typeof obj.getSession('currPage') != 'undefined' && obj.getSession('currPage') == '5' && version == 'v4') {
					$('.iconContainerDiv .getStarted').addClass('hidden');
					$('.iconContainerDiv .btnSkip').removeClass('hidden');
				}
			}

		}

		/* New button */

		obj.startNew = function () {
			debugConsole("startNew");

			sessionStorage.clear();
			lEditor.currentStep = 1;
			$('.step-holder, .footer-strip, .topButtons, .lEditorHeader').addClass('hidden');
			$('.step_1, #root_header').removeClass('hidden');
			$('#logoname, #logoname2, #sloganText').val('');
			$('.le-imageLayout, .common-nav li').removeClass('active');
			$('.hide--icons').remove();
			$('.iconContainerBoxes').html('');
			$('.le--close').trigger('click');

		}

		// using for NOUN API 
		obj.iconsData = function (target) {
			//debugConsole('---Fn iconsdata called----');
			debugConsole("iconsData");
			if (target && target.closest) {
				debugConsole("iconsData111111");
				if (target.closest('.step_5').length > 0) {
					debugConsole("1111111111111");
					//var input = target.closest('.logo-search-form').find('input.tag_input');
					var input = target.closest('.step_5').find('input.tag_input');
					//debugger; 
				}
				else {
					if ($(window).width() < 991) {
						debugConsole("2222222222");
						var input = target.closest('.mobile-selection').find('.logo-search-form input');
						// var input = target.closest('.step_5').find('input#tags');
					}
					else {
						debugConsole("33333333333");
						var input = target.closest('.edit-strip').find('.logo-search-form input');
						//var input = target.closest('.step_5').find('input#tags');
					}
				}

				// var input = target.closest('.logo-search-form').find('input');
				var tagValue = removeMultipleSpaces($(input).val());//$.trim($(input).val());
				debugConsole("tagValue:=" + tagValue);
				// alert(tagValue);
				if (tagValue == "") {
					return false;
				}
				debugConsole("objIconSearch:=" + obj.objIconSearch);
				if (tagValue.toLowerCase() == obj.objIconSearch.toLowerCase()) {
					obj.objIconPage++;
				} else {
					obj.objIconSearch = tagValue;
					obj.objIconPage = 1;

				}
				//debugger;
				obj.ajaxIconsResponse(tagValue);
			}
		}
		// using for NOUN API 
		obj.editIconsData = function () {

			var tagValue = $.trim($('.editTags').val());
			debugConsole("editIconsData tagValue:=" + tagValue);
			if (tagValue == "") {
				return false;
			}

			if (tagValue == obj.objIconSearch) {
				obj.objIconPage++;
				debugConsole("editIconsData tagValue1111111:=" + obj.objIconSearch);
			} else {
				obj.objIconSearch = tagValue;
				obj.objIconPage = 1;
				debugConsole("editIconsData tagValue222222222222:=" + obj.objIconSearch);
			}
			debugConsole("icon value 5:=" + tagValue);
			lEditor.setSession('iconValue', tagValue);
			obj.ajaxEditIconsResponse(tagValue);

		}

		// using for NOUN API 
		obj.ajaxIconsResponse = function (iconSlug) {
			debugConsole("ajaxIconsResponse");
			var is_recommended_fetch = false;
			var iconSlugIndustry = '';
			if (version == 'v4') {
				var industryName = obj.getSession('extraIndustry');
				var iconSlugIndustry = getSlugNew(industryName);
				if (iconSlugIndustry == iconSlug) {
					is_recommended_fetch = true;
				}

			}
			obj.nextIconSearch = true;
			var offset = 0;
			var limit = 100;
			if (obj.objIconPage == 1) {
				$('.loadMoreIcons').hide();
				$('.searchIcon').html('<img src="' + DH.getAssetImgUrl('logo-maker/loading.svg') + '" />');
			} else {
				offset = (obj.objIconPage * limit);
				$('.showIconsDiv .loadMoreIcons').show();
			}

			jqXHR = $.ajax({
				url: DH.baseURL + '/dh_ajax.php',
				type: 'POST',
				data: { action: 'api', type: 'nonEditor', slug: iconSlug, industry_id: lEditor.getSession('industryId'), version: version, offset: offset, limit: limit, action_type: 'icon_tags' },
				dataType: "json",
				beforeSend: function () {

				},
				success: function (res) {

					debugConsole("res.status:=" + res.status);
					if (res.status == 0) {
						$('.searchIcon').html('Search');
						return false;
					}
					debugConsole("res.nxt_search:=" + res.nxt_search);
					if (res.nxt_search == 0) { //i.e no data available
						$('.searchIcon').html('Search');
						obj.nextIconSearch = false;
						$('.loadMoreIcons').hide();
						if (obj.objIconPage == 1) {
							$('.iconsImages, .iconsHint').remove();
							$('.loadMoreIcons').hide();
							$('.iconBlank').removeClass('hidden').text('No result found');
							$('.startIcoSection').addClass('hidden');
							$('.iconsContainerBox, .brickImage').removeClass('hidden');
							$('.flipIconTag').addClass('hidden');
							//obj.nextIconSearch = true;                                                               
						}
						if (version == 'v4' && res.nxt_search == 0) {
							//$('.iconsContainerBox, .brickImage').addClass('hidden');
							$('.showIconsDiv .loadMoreIconsV2').remove();
							// debugger;
						}
						return false;
					}
					if (res.nxt_search == 1 && res.more_icons == 0 && version == 'v4') {
						$('.showIconsDiv .loadMoreIconsV2').remove();
					}
					if (obj.objIconPage == 1) {
						$('.iconsImages, .iconsHint').remove();
						//obj.nextIconSearch = true;
					}
					if (res.nxt_search == 1 || res.more_icons == 0) {
						obj.nextIconSearch = false;
					}
					$('.iconBlank, .startIcoSection').addClass('hidden');
					$('.iconsContainerBox, .brickImage').removeClass('hidden');
					if (version == 'v4') {
						$('.brickImage').addClass('hidden');
					}
					$('.flipIconTag').addClass('hidden');
					if (version == 'v4' && obj.objIconPage == 1 && typeof obj.getSession('currPage') != 'undefined' && obj.getSession('currPage') == '5') {

						$rec_cls = "";
						if (is_recommended_fetch) {
							$rec_cls = "disabled active";
						}

						if (obj.getSession('extraIndustry') != '') {
							$('.icons-hint').append('<a class=" icons-hint-button iconsHint recommend_tag ' + $rec_cls + ' "  data-recommended = "1" data-slug="' + iconSlugIndustry + '">Recommended</a>');
							if (is_recommended_fetch) {
								$('.icons-hint').append('<a class="icons-hint-button iconsHint browse_cat_slug" data-slug="browse_categories" >Browse More Tags <i class="icon icon-plus"></i></a>');
							}


						}
					}

					// var tagArray = [];
					$.each(res.tags, function (key, val) {
						var inputValue = $.trim($('#tags').val());
						inputValue = inputValue.toLowerCase();
						var iconText = $.trim(val.name.toLowerCase());
						var activeClass = '';
						var tagDisp = '';
						if (inputValue == iconText) {
							activeClass = 'active';
						}
						if (typeof obj.getSession('currPage') != 'undefined' && obj.getSession('currPage') == '5') {
							if (version == 'v4' && is_recommended_fetch) {
								tagDisp = 'hidden';
							}
							if (iconSlugIndustry.toLowerCase() != val.slug) {
								// if (val.name != "" && tagArray.indexOf(val.name) == -1) {
								if (val.name != "") {
									$('.icons-hint').append('<a class="icons-hint-button iconsHint ' + tagDisp + ' ' + activeClass + '" data-slug="' + val.slug + '">' + val.name + '</a>');

								}
							}

						}
						else {
							// if (val.name != "" && tagArray.indexOf(val.name) == -1) {
								if (val.name != "") {
									$('.icons-hint').append('<a class="icons-hint-button iconsHint ' + tagDisp + ' ' + activeClass + '" data-slug="' + val.slug + '">' + val.name + '</a>');

								}
							}
							// tagArray.push(val.name);
						});

					$.each(res.icons, function (key, val) {

						$('.iconsParentDiv').append('<a class="icons-images iconsImages" data-pngurl="' + val.url + '" data-svgurl="' + val.icon_url + '" data-id = "' + val.id + '"><img src="' + val.url + '" class="selectedIcons" /></a>');
					});
					$('.loadMoreIcons').hide();
					$('.searchIcon').html('Search');

					if (version == 'v4') {
						if ((res.nxt_search != 0 && res.more_icons == 1)) {
							//Remove existing load more icon button
							$('.showIconsDiv .loadMoreIconsV2').remove();
							$('.showIconsDiv').append('<div class="text-center"><button class="common-btn btn-white load-fewmore loadMoreIconsV2" data-more-icons ="' + res.more_icons + '" >Load A Few More</button></div>');
							$('.showIconsDiv').off('scroll');
							//debugger;
						}
						else {
							$('.showIconsDiv').off('scroll');
							if (obj.objIconPage == 1 && typeof obj.getSession('currPage') != 'undefined' && obj.getSession('currPage') == '5') {
								var bb = $('.step_5 .iconsParentDiv').find('.iconsImages').length;
								//debugger;
								if ($('.step_5 .iconsParentDiv').find('.iconsImages').length > 33 && screen.width >= 800) {
									$('.showIconsDiv .loadMoreIconsV2').remove();
									$('.showIconsDiv').append('<div class="text-center"><button class="common-btn btn-white load-fewmore loadMoreIconsV2" data-more-icons ="' + res.more_icons + '" >Load A Few More</button></div>');
									//debugger;
								}
								else {
									//debugger;
									$('.step_5 .showIconsDiv .loadMoreIconsV2').addClass('hidden');

								}

							}
							//$('.showIconsDiv .loadMoreIconsV2').remove();
						}
						//hide old
						if (obj.objIconPage == 1 && typeof obj.getSession('currPage') != 'undefined' && obj.getSession('currPage') == '5') {

							if ($('.iconsParentDiv').find('.iconsImages').length > 33 && screen.width >= 800) {
								$('.iconsParentDiv .iconsImages:gt(' + 32 + ')').addClass('hidden');
								//debugger;
							}

						}



					}


				}
			});
		},

			// for getting variation of monogram 
			obj.getMonogramVariations = function (p_sLabel, p_fCallBack) {
				debugConsole("getMonogramVariations");
				var currLogo = getValidJsonParseObj(lEditor.getSession('currentLogo'));
				var currContainerBodyObj = currLogo.generate.templatePath.updates.containerBody;
				var isFrameExist = currLogo.generate.templatePath.isFrame;
				var templateDirection = 0;
				if (currLogo.generate.templatePath.isIcon == 1) {
					templateDirection = currLogo.generate.templatePath.template_direction;
				}
				var monogram = (p_sLabel && p_sLabel != "") ? p_sLabel : lEditor.getMonogramText(true);
				debugConsole("monogram:=" + monogram);
				var limit = 10;
				loadMoreStart++;
				jqXHR = $.ajax({
					url: DH.baseURL + '/logoMakerAjax.php',
					type: 'POST',
					data: { action: 'monograms', start: loadMoreStart },
					async: true,
					success: function (json) {
						json = getValidJsonParseObj(json);
						if (json.status == 0) {

						} else {

							var fontList = json.monograms;

							var logoTemp = getValidJsonParseObj(lEditor.getSession('currentLogo'));
							var generateType = "old";
							if (logoTemp.generate.templatePath.isMono == 0) {
								generateType = "new";
							}
							var type = 'icon';
							var i = 0;

							if (loadMoreStart == 1) {
								lEditor.logoTempArr = [];
								lEditor.logoSlider('final', 1);
							}
							var j = (loadMoreStart - 1) * limit;

							var fontListLength = fontList.length;
							// $('.load--more--class').remove();
							if (fontListLength == 0) {
								return false;
							}
							var templateIdStyle = getTempStyle();

							$.each(fontList, function (k, v) {

								opentype.load(v.font_link, function (err, font) {
									try {
										if (err) {
											alert('Font could not be loaded: ' + v.font_link + ' -- ' + err);
										} else {
											debugConsole("generateType:=" + generateType);
											if (generateType == "old") {
											} else {
												var isMono = 1;
												var isIcon = 0;
												var isFrame = 0;
												var isIconFrame = 0;
												var isEqual = 0;
												if (typeof logoTemp.generate.templatePath.isFrame !== "undefined") {
													isFrame = logoTemp.generate.templatePath.isFrame;
												}

												if (typeof logoTemp.generate.templatePath.isIconFrame !== "undefined") {
													isIconFrame = logoTemp.generate.templatePath.isIconFrame;
												}
												if (typeof logoTemp.generate.templatePath.isEqual !== "undefined") {
													isEqual = logoTemp.generate.templatePath.isEqual;
												}
												var isDBLineCompanyText = "no";
												if (logoTemp.generate.templatePath.isDBLineCompanyText && (logoTemp.generate.templatePath.isDBLineCompanyText == "yes")) {
													isDBLineCompanyText = logoTemp.generate.templatePath.isDBLineCompanyText;
												}
												var getTemplateList = getTemplatesByType(templateDirection, isIcon, isMono, isFrame, isIconFrame, isEqual, isDBLineCompanyText);
												var templates = getTemplateList[0];
												logoTemp.generate.templatePath = templates[0];
												if (getTemplateList[1].length > 1) {
													var templatesDir = getTemplateList[1];
													logoTemp.generate.templatePath.template_direction = templatesDir[0];
												}
												if (getTemplateList[2].length > 1) {
													var templatesId = getTemplateList[2];
													logoTemp.generate.templatePath.template_id = templatesId[0];
												}
											}
											var icon = font.getPath(monogram, 0, 0, constantVars.ORIGINAL_SPACING.monogramTextSize);
											logoTemp.generate.iconPath = icon.toSVG();

											var idKey = logoMakerFunction.genRandomId();
											logoTemp.generate.idKey = idKey;
											//	if(currObj.generate.templatePath.isFrame==1){
											debugConsole("logoTemp template id:=" + logoTemp.generate.templatePath.template_id);
											debugConsole("logoTemp template_direction:=" + logoTemp.generate.templatePath.template_direction);
											logoTemp.monofId = v.font_id;
											logoTemp.generate.templatePath.frameType = currLogo.generate.templatePath.frameType;
											logoTemp.generate.templatePath.frameOverlap = currLogo.generate.templatePath.frameOverlap;
											debugConsole("debug1");
											if (currLogo.generate.templatePath.isFrame == 1) {
												debugConsole("debug2");
												logoTemp.generate.templatePath.frame_width = currLogo.generate.templatePath.frame_width;

												logoTemp.generate.templatePath.frame_height = currLogo.generate.templatePath.frame_height;

												logoTemp.generate.templatePath.frameShapeName = currLogo.generate.templatePath.frameShapeName;

												logoTemp.generate.templatePath.frmId = currLogo.generate.templatePath.frmId;
												debugConsole("debug3");
											}

											logoTemp.generate.fontName = v.font_link;
											logoTemp.generate.templatePath.sloganSetAsPerText = currLogo.generate.templatePath.sloganSetAsPerText;
											if (currLogo.generate.templatePath.isDBLineCompanyText && currLogo.generate.templatePath.isDBLineCompanyText == "yes") {
												logoTemp.generate.templatePath.isDBLineCompanyText = currLogo.generate.templatePath.isDBLineCompanyText;
											}
											debugConsole("debug4");
											//	}
											var returnObj = null;
											if (generateType == "old") {
												returnObj = logoMakerFunction.generateLogoTemplateByOption(logoTemp, type, idKey, null, null, "changemongram");
												logoTemp.generate = returnObj.logoObj;
												if (isFrameExist == 1) {
													returnObj = logoMakerFunction.generateLogoTemplateByOption(logoTemp, 'containerBody', idKey);
													debugConsole("111111111");
												} else {
													returnObj = logoMakerFunction.generateLogoTemplateByOption(logoTemp, 'containerBody', idKey, currContainerBodyObj);
													debugConsole("111111111");
												}
											} else {
												if (isFrameExist == 1) {
													returnObj = logoMakerFunction.generateLogoTemplate(logoTemp.generate, idKey, null, null, null, true, "monogramVariations");
												} else {
													returnObj = logoMakerFunction.generateLogoTemplate(logoTemp.generate, idKey, null, null, currContainerBodyObj, true, "monogramVariations");
												}
												debugConsole("222222222222222");
											}
											logoTemp.generate = returnObj.logoObj;
											currObj = updateCurrLogoObject(logoTemp);

											lEditor.logoTempArr[j] = getValidJsonParseObj(getValidJsonStringifyObj(currObj));

											var templateHint = showLogoAdminIds(logoTemp.generate.templatePath, logoTemp.sloganName, logoTemp.fId, logoTemp.cpId, logoTemp.sfId, logoTemp.frmId, logoTemp.iconFrameId, logoTemp.monofId);

											slickElement = '<div class="logos--boxes"><div class="logo--slides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="logoSlide-overlay  gradient-div"><a href="javascript:;" class="icons-edit icons-update setDefaultLogo" data-type="monogram-update" data-id="' + (j++) + '"><span>Update to this</span></a></div><div class="svg--slide" style="background-color:' + currObj.generate.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + returnObj.html + '</div></div></div></div>';
											$(".finalogoSlider").append(slickElement);
											dh_utility_common.changeBg();
											i++;
											if (json.pagination == 1 && i == fontListLength) {
												if ($('.load--more--class').length) {
													$('.load--more--class').remove();
												}
												$(".finalogoSlider").append('<div class="load--more--class"><a class="loadMoreMonograms load--more--button" href="javascript:;"><span class="load--more-shadow"><span class="final--loader loadMoreLogosBoxes" style="display:none;"><img src="' + DH.getAssetImgUrl('logo-maker/loading.svg') + '" /></span>Load More</span></a></div>');
												if (p_fCallBack) {
													p_fCallBack();
												}
											} else {
												if ($('.load--more--class').length) {
													$('.load--more--class').remove();
												}
												if (json.pagination == 0) {
													if (p_fCallBack) {
														p_fCallBack();
													}
												}
											}
										}

									} catch (e) {
									}
								});
							});

						}
					}
				});
			},

			// using for NOUN API 
			obj.ajaxEditIconsResponse = function (iconSlug, p_fCallBack) {
				//
				// $(".editLogoSlider .loadMoreIcons").css({ top: '60%', left: '0%' });
				// $(".editLogoSlider .loadMoreIcons").show();
				debugConsole("ajaxEditIconsResponse");
				var currLogo = getValidJsonParseObj(lEditor.getSession('currentLogo'));
				var isFrameExist = currLogo.generate.templatePath.isFrame;
				var isDBLineCompanyText = "no";
				var splitLogoName = "";
				if (currLogo.generate.templatePath.isDBLineCompanyText == "yes") {
					isDBLineCompanyText = currLogo.generate.templatePath.isDBLineCompanyText;
				}
				var templateDirection = 0;
				if (currLogo.generate.templatePath.isMono == 1) {
					templateDirection = currLogo.generate.templatePath.template_direction;
				}
				if (currLogo.generate.splitLogoName) {
					splitLogoName = currLogo.generate.splitLogoName;
				}
				var offset = 0;
				var limit = 6;
				if (typeof iconSlug === "undefined" || (iconSlug == "")) {
					iconSlug = obj.getSession('iconValue');
				}
				if (obj.objIconPage == 1) {

				}
				var i = 0;
				loadMoreStart++;
				if (loadMoreStart == 1) {
					lEditor.logoTempArr = [];
					lEditor.logoSlider('final', 0);
					$('.editSearchButton').html('<img src="' + DH.getAssetImgUrl('logo-maker/loading.svg') + '" />');
				}
				else {
					limit = loadMoreStart * limit;
				}
				var j = (loadMoreStart - 1) * limit;
				jqXHR = $.ajax({
					url: DH.baseURL + '/dh_ajax.php',
					type: 'POST',
					data: { action: 'api', action_type: 'icon_tags', type: 'editor', slug: iconSlug, offset: offset, limit: limit },
					dataType: "json",
					beforeSend: function () {

					},
					success: function (res) {
						debugConsole("ajaxEditIconsResponse success1:=" + iconSlug);
						debugConsole("res.status:=" + res.status);
						$('.editSearchButton').html('Search');
						if (loadMoreStart == 1) {
							if (res.icons.length == 0) {
								debugConsole("no result found for icon name " + iconSlug);
								$('.editSearchButton').html('Search');
								$('.icons-search-box, .icons-search-box-button').css("pointer-events", "auto");
								$('.finalogoSlider').html('<div class="result-option noResultFound text-center no-icon-result">No Result Found.</div>');
								$('.editTags').val("");
								lEditor.cleanSession('iconValue');
								// $(".editLogoSlider .loadMoreIcons").hide();
								return false;
							}
						}
						if (res.status == 0) {
							debugConsole("Icon API not working");
							$('.loadMoreEditorIcons, .icons-search-box, .icons-search-box-button').css("pointer-events", "auto");
							// $(".editLogoSlider .loadMoreIcons").hide();
							return false;
						}

						$.each(res.tags, function (key, val) {
							var inputValue = $.trim($('#tags').val());
							inputValue = inputValue.toLowerCase();
							var iconText = $.trim(val.name.toLowerCase());
							// debugConsole("iconText:="+iconText);
							var activeClass = '';
							if (inputValue == iconText) {
								activeClass = 'active';
							}
							if (val.name != "") {
								$('.icons-hint').append('<a class="icons-hint-button iconsHint ' + activeClass + '" data-slug="' + val.slug + '">' + val.name + '</a>');
							}
						});
						var templateIdStyle = getTempStyle();
						var svgUrls = [];
						$.each(res.icons, function (key, val) {
							var svgObj = new Object();
							svgObj.id = val.id;
							svgObj.svgurl = val.icon_url;
							svgUrls.push(svgObj);
							// svgUrls.push(val.icon_url);
							// debugConsole("icon id from api:=" + val.id);

						});

						var logoTemp = getValidJsonParseObj(lEditor.getSession('currentLogo'));
						var currContainerBodyObj = logoTemp.generate.templatePath.updates.containerBody;
						var currLogoContainerObj = logoTemp.generate.templatePath.updates.logoContainer;

						var generateType = "old";
						if (logoTemp.generate.templatePath.isIcon == 0) {
							generateType = "new";
						}
						var type = 'icon';
						var iconsLength = svgUrls.length;
						$('.noResultFound').remove();
						if (iconsLength == 0) {
							$('.loadMoreEditorIcons, .icons-search-box, .icons-search-box-button').css("pointer-events", "auto");
							// $(".editLogoSlider .loadMoreIcons").hide();
							return false;
						}
						// $('.load--more--class').remove();
						jqXHR1 = $.ajax({
							url: DH.baseURL + '/dh_ajax.php',
							type: 'POST',
							data: { action: 'svg', 'icons': svgUrls },
							async: false,
							success: function (json) {
								debugConsole("result found for icon name " + iconSlug);
								$('.loadMoreEditorIcons, .icons-search-box, .icons-search-box-button').css("pointer-events", "auto");
								// $(".editLogoSlider .loadMoreIcons").hide();
								if ($('.iconBlank').length) {
									$('.iconBlank').remove();
								}
								$('.editTags').attr("lastSearchIcon", iconSlug);
								var json = getValidJsonParseObj(json);
								if (json[0].originalicons) {
									$.each(json[0].originalicons, function (k1, v1) {
										obj.sliderData.originalIcons.push(v1);
									});
									obj.findIconNameSpace();
								}
								$.each(json[0].icons, function (k, v) {
									if (v != "") logoTemp.generate.iconPath = v;
									logoTemp.iconId = k;
									debugConsole("k:=" + k);
									var idKey = logoMakerFunction.genRandomId();
									logoTemp.generate.idKey = idKey;
									logoTemp.generate.iconName = lEditor.getSession("iconValue");
									debugConsole("generateType:=" + generateType);
									if (generateType == "old") {
										logoTemp.generate.templatePath.sloganSetAsPerText = currLogo.generate.templatePath.sloganSetAsPerText;
										var returnObj = logoMakerFunction.generateLogoTemplateByOption(logoTemp, type, idKey, currContainerBodyObj, null, "changeSymbol");
									} else {
										var isIcon = 1;
										var isMono = 0;
										var isFrame = 0;
										var isIconFrame = 0;
										var isEqual = 0;

										if (typeof logoTemp.generate.templatePath.isFrame !== "undefined") {
											isFrame = logoTemp.generate.templatePath.isFrame;
										}
										if (typeof logoTemp.generate.templatePath.isIconFrame !== "undefined") {
											isIconFrame = logoTemp.generate.templatePath.isIconFrame;
										}
										if (typeof logoTemp.generate.templatePath.isEqual !== "undefined") {
											isEqual = logoTemp.generate.templatePath.isEqual;
										}

										var templates = getTemplatesByType(templateDirection, isIcon, isMono, isFrame, isIconFrame, isEqual, isDBLineCompanyText)[0];
										logoTemp.generate.templatePath = templates[0];
										logoTemp.generate.templatePath.frameType = currLogo.generate.templatePath.frameType;
										logoTemp.generate.templatePath.frameOverlap = currLogo.generate.templatePath.frameOverlap;
										logoTemp.generate.templatePath.isDBLineCompanyText = currLogo.generate.templatePath.isDBLineCompanyText;
										if (currLogo.generate.templatePath.isFrame == 1) {

											logoTemp.generate.templatePath.frame_width = currLogo.generate.templatePath.frame_width;

											logoTemp.generate.templatePath.frame_height = currLogo.generate.templatePath.frame_height;

											logoTemp.generate.templatePath.frameShapeName = currLogo.generate.templatePath.frameShapeName;

											logoTemp.generate.templatePath.frmId = currLogo.generate.templatePath.frmId;
										}


										logoTemp.generate.templatePath.sloganSetAsPerText = currLogo.generate.templatePath.sloganSetAsPerText;
										debugConsole("logoObj.bgColor:=" + logoTemp.generate.bgColor);
										debugConsole("logoObj.iconColor:=" + logoTemp.generate.iconColor);
										if (logoTemp.generate.bgColor == "#000000" || logoTemp.generate.bgColor == "#000" || logoTemp.generate.bgColor == "black") {
											if (removeMultipleSpaces(logoTemp.generate.iconColor) == "" || logoTemp.generate.iconColor == logoTemp.generate.bgColor) {
												logoTemp.generate.iconColor = "#ffffff";
											}
										}
										var returnObj = null;
										debugConsole("isFrameExist:=" + isFrameExist);
										if (isFrameExist == 1) {

											if (isDBLineCompanyText == "yes") {
												var logoTextList = lEditor.getLogoTextList(splitLogoName);

												var logo1 = currCompFontObject.getPath(logoTextList[0], 0, 0, constantVars.ORIGINAL_SPACING.logoTextSlider, { 'letterSpacing': parseFloat(constantVars.SPACING.logoLetterSpacing) });
												logoTemp.generate.logoPath1 = logo1.toSVG();

												var logo2 = currCompFontObject.getPath(logoTextList[1], 0, 0, constantVars.ORIGINAL_SPACING.logoTextSlider, { 'letterSpacing': parseFloat(constantVars.SPACING.logoLetterSpacing) });
												logoTemp.generate.logoPath2 = logo2.toSVG();

												returnObj = logoMakerFunction.generateLogoTemplate(logoTemp.generate, idKey, constantVars.ORIGINAL_SPACING.logoTextSlider, null, null, true, "addNewSymbol");

											} else {
												var logo = currCompFontObject.getPath(lEditor.getSession("logoname"), 0, 0, constantVars.ORIGINAL_SPACING.logoTextSlider, { 'letterSpacing': parseFloat(constantVars.SPACING.logoLetterSpacing) });
												logoTemp.generate.logoPath = logo.toSVG();

												returnObj = logoMakerFunction.generateLogoTemplate(logoTemp.generate, idKey, constantVars.ORIGINAL_SPACING.logoTextSlider, null, null, true, "addNewSymbol");
											}
										} else {
											returnObj = logoMakerFunction.generateLogoTemplate(logoTemp.generate, idKey, null, null, currContainerBodyObj, true, "addNewSymbol");
										}

									}

									logoTemp.generate = returnObj.logoObj;
									currObj = updateCurrLogoObject(logoTemp);
									obj.logoTempArr[j] = getValidJsonParseObj(getValidJsonStringifyObj(currObj));

									var templateHint = showLogoAdminIds(logoTemp.generate.templatePath, logoTemp.sloganName, logoTemp.fId, logoTemp.cpId, logoTemp.sfId, logoTemp.frmId, logoTemp.iconFrameId, logoTemp.monofId);

									slickElement = '<div class="logos--boxes"><div class="item logo--slides logoSlides" style="background-color:' + currObj.generate.bgColor + ';"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="logoSlide-overlay gradient-div"><a href="javascript:;" class="icons-edit icons-update setDefaultLogo" data-type="icon" data-id="' + (j++) + '"><span>Update to this</span></a></div><div class="svg--slide"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + returnObj.html + '</div></div></div></div>';
									$(".finalogoSlider").append(slickElement);
									dh_utility_common.changeBg();
									i++;
									if (i % limit == 0 && obj.nextIconSearch == true) {
										if ($('.load--more--class').length) {
											$('.load--more--class').remove();
										}
										$(".finalogoSlider").append('<div class="load--more--class"><a class="loadMoreEditorIcons load--more--button" href="javascript:;"><span class="load--more-shadow"><span class="final--loader loadMoreLogosBoxes" style="display:none;"><img src="' + DH.getAssetImgUrl('logo-maker/loading.svg') + '" /></span>Load More</span></a></div>');
										if (p_fCallBack) {
											p_fCallBack();
										}
									}
									else {
										if (i == 1) {
											if ($('.load--more--class').length) {
												$('.load--more--class').remove();
											}
										}
									}
									$('.finaLogoInner').html('');
								});
							}
						});

						$('.editSearchButton').html('Search');
					}
				});


			}

		// using for NOUN API  
		obj.selectedIcons = function (objIcon) {
			debugConsole("selectedIcons:=" + objIcon);
			if (obj.sampleIconArr.containObject(objIcon)) {
				return false;
			}
			if ($.inArray(objIcon, obj.sampleIconArr) < 0) {
				for (var i = 0; i < 5; i++) {
					if (typeof obj.sampleIconArr[i] === 'undefined' || obj.sampleIconArr[i].pngurl == null) {
						obj.sampleIconArr[i] = objIcon;
						debugConsole(objIcon);
						break;
					}
				}
			}
			return obj.sampleIconArr;
		}

		// using for NOUN API 
		obj.addSelectedIcon = function () {
			debugConsole("addSelectedIcon");
			var boxLength = 0;
			var isCountFive = true;

			$('.symbol-container .iconContainerBoxes').html('');
			$('.symbol-container .iconEditContainerBoxes').html('');
			for (var i = 0, length = obj.sampleIconArr.length; i < length; i++) {
				boxLength = 1;
				$('.symbol-container .iconContainerBoxes[data-containerbox="' + (i + 1) + '"]').html('<img src="' + obj.sampleIconArr[i].pngurl + '" /><span class="delete-icon"><img class="icon-remove" src="' + DH.getAssetImgUrl('logo-maker/close.svg') + '"></span>');
				$('.symbol-container .iconEditContainerBoxes[data-containerbox="' + (i + 1) + '"]').html('<img src="' + obj.sampleIconArr[i].pngurl + '" /><span class="delete-icon" data-placement="bottom"><img class="icon-remove" src="' + DH.getAssetImgUrl('logo-maker/close.svg') + '"></span>');
			}

			if (obj.sampleIconArr.length == 5) {
				$('.iconSection, .editSelectionContainer').append('<div class="hide--icons"><span>You can select upto 5 symbols. Please remove selected symbols from above if you want to add more.</span></div>');
				$('.iconSection').css('box-shadow', 'none');
			}
			obj.setSession('sampleIcon', getValidJsonStringifyObj({ "si": obj.sampleIconArr }));
			$('.symbol-section .symbol-text')[obj.sampleIconArr.length > 0 ? 'hide' : 'show']();
			$('.symbol-section .icons-container')[obj.sampleIconArr.length > 0 ? 'show' : 'hide']();
			obj.skipBtn(boxLength);
		}

		// using for NOUN API 
		obj.removeSelectedIcon = function (i) {
			debugConsole("removeSelectedIcon");
			if (obj.sampleIconArr[i]) {
				var iconId = obj.sampleIconArr[i].id;
				$('.showIconsDiv [data-id="' + iconId + '"]').removeClass('active');
				$('.editShowIconsDiv [data-id="' + iconId + '"]').removeClass('active');
				obj.sampleIconArr.splice(i, 1);
				obj.setSession('sampleIcon', getValidJsonStringifyObj({ "si": obj.sampleIconArr }));
				$('.hide--icons').remove();
			}
		}

		// using for NOUN API 
		obj.getSliderDataIcons = function (callback) {
			debugConsole("getSliderDataIcons111111111111111");
			obj.sliderData.icons = [];
			obj.sliderData.iconsId = [];
			var icons = getValidJsonParseObj(obj.getSession('sampleIcon'));

			if (typeof icons === 'undefined' || icons == null || icons.si === "") {
				icons = { "si": [] };
				sessionStorage.setItem('sampleIcon', icons);
				// return;
			}
			var svgUrls = [];
			obj.sliderData.icons = [];
			obj.sliderData.iconsId = [];

			$.each(icons.si, function (k, v) {
				var svgObj = new Object();
				svgObj.id = v.id;
				svgObj.svgurl = v.svgurl;
				svgUrls.push(svgObj);
				// svgUrls.push(v.svgurl);
			});
			jqXHR = $.ajax({
				url: DH.baseURL + '/dh_ajax.php',
				type: 'POST',
				data: { action: 'svg', 'icons': svgUrls },
				//async: false,
				success: function (json) {
					var json = getValidJsonParseObj(json);
					if (json[0].icons) {
						$.each(json[0].icons, function (k, v) {
							if (v != "") obj.sliderData.icons.push(v);
							obj.sliderData.iconsId.push(k);
						});
					}

					if (json[0].originalicons) {
						$.each(json[0].originalicons, function (k1, v1) {
							obj.sliderData.originalIcons.push(v1);
						});
						obj.findIconNameSpace();
					}
					callback();
				}
			});
		}
		obj.findIconNameSpace = function () {
			try {
				var currPage = lEditor.currentStep;
				// var edit_in_new_tab = lEditor.getSession('edit_in_new_tab');
				debugConsole("currPage:=" + currPage);
				// debugConsole("edit_in_new_tab:=" + edit_in_new_tab);
				debugConsole("icons length:=" + obj.sliderData.icons.length);
				if ((currPage == 5 || currPage == 6) && (obj.sliderData.originalIcons.length > 0) && ((obj.sliderData.originalIcons[0] === "false") || (obj.sliderData.originalIcons[0] === false) || (obj.sliderData.originalIcons[0] === ""))) {
					$("#logomaker_icon_expired").modal('show');
					forceConsoleAtLive("icon is expired so on refreshing we remove the icon and reload the page");
					return;
				}
			} catch (err) {
				forceConsoleAtLive("something went wrong in showIconExpiredPopup ", err);
			}
			var iconNameSpaceList = [];
			if (obj.sliderData.originalIcons && obj.sliderData.originalIcons.length > 0 && obj.sliderData.icons.length > 0) {

				if ((obj.sliderData.originalIcons[0] === "false") || (obj.sliderData.originalIcons[0] === false) || (obj.sliderData.originalIcons[0] === "")) {
					return;
				}
				$.each(obj.sliderData.originalIcons, function (k, v) {
					// debugConsole("icons:=" + obj.sliderData.icons.length);
					// debugConsole("originalIcons:="+obj.sliderData.originalIcons);
					if (obj.sliderData.originalIcons[k]) {
						obj.sliderData.originalIcons[k] = obj.sliderData.originalIcons[k].replace("<svg", "<svg id=svgid" + (k + 1));

						// debugConsole("originalIcons:=" + (k + 1));
						var ab = "<div>" + obj.sliderData.originalIcons[k] + "</div>";
						if ($(ab).find("#svgid" + (k + 1)).attr("xmlns")) {
							// debugConsole("xmlns:=" + $(ab).find("#svgid" + (k + 1)).attr("xmlns"));
							iconNameSpaceList.push("xmlns^" + $(ab).find("#svgid" + (k + 1)).attr("xmlns"));
						}
						if ($(ab).find("#svgid" + (k + 1)).attr("xmlns:xlink")) {
							// debugConsole("xmlns:xlink:=" + $(ab).find("#svgid" + (k + 1)).attr("xmlns:xlink"));
							iconNameSpaceList.push("xmlns:xlink^" + $(ab).find("#svgid" + (k + 1)).attr("xmlns:xlink"));
						}
						if ($(ab).find("#svgid" + (k + 1)).attr("xmlns:svg")) {
							// debugConsole("xmlns:svg:=" + $(ab).find("#svgid" + (k + 1)).attr("xmlns:svg"));
							iconNameSpaceList.push("xmlns:svg^" + $(ab).find("#svgid" + (k + 1)).attr("xmlns:svg"));
						}
					}
				});
				// debugConsole("iconNameSpaceList:=" + JSON.stringify(iconNameSpaceList));
				var jsonObject = iconNameSpaceList.map(JSON.stringify);

				var uniqueSet = new Set(jsonObject);
				obj.iconNameSpaceList = Array.from(uniqueSet).map(JSON.parse);
				debugConsole("filter iconNameSpaceList" + obj.iconNameSpaceList);
			}
		}
		// for setting default Logo 	
		obj.setDefaultLogo = function (object, generate, p_fCallBack) {
			debugConsole("setDefaultLogo");
			var currLogo = getValidJsonParseObj(obj.getSession('currentLogo'));
			$.each(object, function (k, v) {
				currLogo[k] = object[k];
			});
			$.each(generate, function (k, v) {
				currLogo.generate[k] = generate[k];
			});

			obj.currentLogo = currLogo;
			obj.setSession('currentLogo', getValidJsonStringifyObj(currLogo));
			if (p_fCallBack) {
				p_fCallBack();
			}

		}

		// for lgoo slider ( initially use owl now removed
		obj.logoSlider = function (type, isNew) {
			debugConsole("logoSlider:= type:=" + type + ",,,," + isNew);
			$(".sliderContainer").html('');
			if (isNew == 1) {
				$(".finalogoSlider").html('');
			}
			if (isNew == 1) {
				if (type == "final") {
					$(".finalogoSlider").html('<div class="owl-carousel logoSlider logo--slider owl-theme"></div>');
				} else if (type == "step6") {
					$(".sliderContainer").html('<div class="owl-carousel logoSlider logo--slider owl-theme"></div>');
				}
			}
		}
		obj.validateJSON = (currentJSON, p_oDataAnalysisObj) => {
			// debugConsole("validateJSON:=" + currentJSON + ",,," + typeof (currentJSON) + ",,,,," + JSON.stringify(currentJSON));
			var tempJSON = JSON.parse(JSON.stringify(currentJSON));
			if (tempJSON.generate.iconFramePath == "") {
				tempJSON.generate.iconFrameColor = '';
				tempJSON.generate.iconFrameGradient = '';
			}
			if (tempJSON.generate.iconPath == "") {
				tempJSON.generate.iconColor = '';
				tempJSON.generate.iconGradient = '';
				tempJSON.generate.iconFrameColor = '';
				tempJSON.generate.iconFrameGradient = '';

			}
			if (tempJSON.generate.framePath == "") {
				tempJSON.generate.frameColor = '';
				tempJSON.generate.frameGradient = '';
			}
			if (tempJSON.generate.sloganPath == '<path d=""/>') {
				tempJSON.generate.sloganTextColor = '';
				tempJSON.generate.sloganGradient = '';
			}
			if (tempJSON.generate.logoPath == '<path d="M 0 0 l 1 0" stroke="white" stroke-width="0" fill ="none" />') {
				tempJSON.generate.mainTextColor = '';
				tempJSON.generate.textGradient = '';
				tempJSON.generate.mainTextColor = '';
				tempJSON.generate.text2Gradient = '';
			}
			if (p_oDataAnalysisObj) {
				tempJSON.data_analysis = p_oDataAnalysisObj;
			}
			return tempJSON;
		}
		// for saving logo
		obj.saveDefaultLogo = function (key, p_sType, p_sGeTargetLink) {
			debugConsole("obj saveDefaultLogo key:=" + key + ",,,p_sType:=" + p_sType + ",,,,p_sGeTargetLink:=" + p_sGeTargetLink);
			debugConsole("obj.logoTempArr length:=" + obj.logoTempArr.length);
			debugConsole("obj.logoTempArr:=" + obj.logoTempArr);
			var currLogo = obj.logoTempArr[key];
			let oldLogoObj = obj.currentLogo; // last logo object
			let newLogoObj = currLogo; // new selected logo object
			// debugConsole("currLogo:=" + JSON.stringify(currLogo));
			var parentDiv = null;
			var workFor = null;
			switch (p_sType) {
				case "icon":
					currLogo.generate.logoSizeSlider = constantVars.SPACING.logoSizeSlider;
					currLogo.generate.iconDistanceSlider = constantVars.SPACING.iconDistanceSlider;
					currLogo.generate.textSloganDistSlider = constantVars.SPACING.textSloganDistSlider;
					switch (p_sGeTargetLink) {
						case 31:
							// if (currLogo.generate.templatePath.isEqual == 1) {
							// 	logoMakerFunction.setSliderForSloganLetterSpacing(currLogo.generate.sloganLetterSpacing);
							// }
							if (currLogo.generate.templatePath.isIcon == 1) {
								editorUndoRedo.setUndoActData(SYMBOL_ADD, oldLogoObj, newLogoObj);
							}
							if (typeof currLogo.generate.templatePath.sloganSetAsPerText != "undefined" && currLogo.generate.templatePath.sloganSetAsPerText == 1) {
								logoMakerFunction.setSliderForSloganLetterSpacing(currLogo.generate.sloganLetterSpacing);
							}
							if (newLogoObj.generate.templatePath.isDBLineCompanyText == "yes") {
								debugConsole("come here1");
								if (newLogoObj.generate.hasOwnProperty("logoText1Slider")) {
									delete newLogoObj.generate["logoText1Slider"];
								}
								if (newLogoObj.generate.hasOwnProperty("logoText2Slider")) {
									delete newLogoObj.generate["logoText2Slider"];
								}
								if (newLogoObj.generate.hasOwnProperty("logoText1LetterSpacing")) {
									delete newLogoObj.generate["logoText1LetterSpacing"];
								}
								if (newLogoObj.generate.hasOwnProperty("logoText2LetterSpacing")) {
									delete newLogoObj.generate["logoText2LetterSpacing"];
								}
							}
							break;
						case 27:
							if ((currLogo.generate.templatePath.isIcon == 1) && (obj.currentLogo.generate.templatePath.isIcon == 1)) {
								editorUndoRedo.setUndoActData(SYMBOL_CHANGE, oldLogoObj, newLogoObj);
							}
							break;
					}
					break;
				case "monogram-update":
					switch (p_sGeTargetLink) {
						case 32:
							// if (currLogo.generate.templatePath.isEqual == 1) {
							// 	logoMakerFunction.setSliderForSloganLetterSpacing(currLogo.generate.sloganLetterSpacing);
							// }
							if (currLogo.generate.templatePath.isMono == 1) {
								editorUndoRedo.setUndoActData(MONOGRAM_ADD, oldLogoObj, newLogoObj);
							}
							if (typeof currLogo.generate.templatePath.sloganSetAsPerText != "undefined" && currLogo.generate.templatePath.sloganSetAsPerText == 1) {
								logoMakerFunction.setSliderForSloganLetterSpacing(currLogo.generate.sloganLetterSpacing);
							}
							break;
						case 39:
							currLogo.generate.logoSizeSlider = constantVars.SPACING.logoSizeSlider;
							if ((currLogo.generate.templatePath.isMono == 1) && (obj.currentLogo.generate.templatePath.isMono == 1)) {
								editorUndoRedo.setUndoActData(MONOGRAM_CHANGE, oldLogoObj, newLogoObj);
								lEditor.setMonogramText($('.editMonogramText').val());
							}
							break;
					}
					break;
				case undefined:
					if (p_sGeTargetLink === 30) {
						// if (currLogo.generate.templatePath.isEqual == 1) {
						// 	logoMakerFunction.setSliderForSloganLetterSpacing(currLogo.generate.sloganLetterSpacing);
						// }
						currLogo.generate.frameSizeSlider = constantVars.ORIGINAL_SPACING.frameSizeSlider;
						editorUndoRedo.setUndoActData(GENERATE_MORE_LOGOS, oldLogoObj, newLogoObj);

						if (typeof currLogo.generate.templatePath.sloganSetAsPerText != "undefined" && currLogo.generate.templatePath.sloganSetAsPerText == 1) {
							logoMakerFunction.setSliderForSloganLetterSpacing(currLogo.generate.sloganLetterSpacing);
						}

						if (newLogoObj.generate.templatePath.isDBLineCompanyText == "yes") {
							debugConsole("come here1");
							if (newLogoObj.generate.hasOwnProperty("logoText1Slider")) {
								delete newLogoObj.generate["logoText1Slider"];
							}
							if (newLogoObj.generate.hasOwnProperty("logoText2Slider")) {
								delete newLogoObj.generate["logoText2Slider"];
							}
							if (newLogoObj.generate.hasOwnProperty("logoText1LetterSpacing")) {
								delete newLogoObj.generate["logoText1LetterSpacing"];
							}
							if (newLogoObj.generate.hasOwnProperty("logoText2LetterSpacing")) {
								delete newLogoObj.generate["logoText2LetterSpacing"];
							}
						}
					}
					break;
				case "color":
					switch (p_sGeTargetLink) {
						case 29:
							// if (currLogo.generate.templatePath.isEqual == 1) {
							// 	logoMakerFunction.setSliderForSloganLetterSpacing(currLogo.generate.sloganLetterSpacing);
							// }
							currLogo.generate.frameSizeSlider = constantVars.ORIGINAL_SPACING.frameSizeSlider;
							editorUndoRedo.setUndoActData(LAYOUT_VARIATIONS, oldLogoObj, newLogoObj);
							if (typeof currLogo.generate.templatePath.sloganSetAsPerText != "undefined" && currLogo.generate.templatePath.sloganSetAsPerText == 1) {
								logoMakerFunction.setSliderForSloganLetterSpacing(currLogo.generate.sloganLetterSpacing);
							}
							break;
						case 3:
						case 12:
							editorUndoRedo.setUndoActData(EDIT_COLORS_BG, oldLogoObj, newLogoObj);
							break;
						case 13:
							parentDiv = $('.subChild-13').find(".company-text-color-box");
							workFor = parentDiv.attr("last_selected");
							switch (workFor) {
								case "dd-ct-color-line1":
									editorUndoRedo.setUndoActData(EDIT_COLORS_LOGO_TEXT1, oldLogoObj, newLogoObj);
									break;
								case "dd-ct-color-line2":
									editorUndoRedo.setUndoActData(EDIT_COLORS_LOGO_TEXT2, oldLogoObj, newLogoObj);
									break;
								case "dd-ct-color-overall":
								default:
									editorUndoRedo.setUndoActData(EDIT_COLORS_LOGO_TEXT, oldLogoObj, newLogoObj);
									break;
							}
							break;
						case 14:
							editorUndoRedo.setUndoActData(EDIT_COLORS_SLOGAN_TEXT, oldLogoObj, newLogoObj);
							break;
						case 15:
							editorUndoRedo.setUndoActData(EDIT_COLORS_SYMBOL, oldLogoObj, newLogoObj);
							break;
						case 43:
							editorUndoRedo.setUndoActData(EDIT_COLORS_INNER_CONTAINER, oldLogoObj, newLogoObj);
							break;
						case 16:
							editorUndoRedo.setUndoActData(EDIT_COLORS_OUTER_CONTAINER, oldLogoObj, newLogoObj);
							break;
						case 26:
							editorUndoRedo.setUndoActData(EDIT_COLORS_VARIATIONS, oldLogoObj, newLogoObj);
							break
					}
					break;
				case "frame":
					switch (p_sGeTargetLink) {
						case 24:
							if (currLogo.generate.templatePath.isFrame == 1) {
								editorUndoRedo.setUndoActData(OUTER_CONTAINER_ADD, oldLogoObj, newLogoObj);
							}
							break;
						case 42:
							currLogo.generate.frameSizeSlider = constantVars.ORIGINAL_SPACING.frameSizeSlider;
							currLogo.generate.logoSizeSlider = constantVars.ORIGINAL_SPACING.logoSizeSlider;
							currLogo.generate.textSloganDistSlider = constantVars.ORIGINAL_SPACING.textSloganDistSlider;
							if ((currLogo.generate.templatePath.isFrame == 1) && (obj.currentLogo.generate.templatePath.isFrame == 1)) {
								editorUndoRedo.setUndoActData(OUTER_CONTAINER_CHANGE, oldLogoObj, newLogoObj);
							}
							break;
						case 40:
							if (currLogo.generate.templatePath.isIconFrame == 1) {
								editorUndoRedo.setUndoActData(INNER_CONTAINER_ADD, oldLogoObj, newLogoObj);

							}
							break;
						case 44:
							if ((currLogo.generate.templatePath.isIconFrame == 1) && (obj.currentLogo.generate.templatePath.isIconFrame == 1)) {
								editorUndoRedo.setUndoActData(INNER_CONTAINER_CHANGE, oldLogoObj, newLogoObj);
								currLogo.generate.logoSizeSlider = constantVars.ORIGINAL_SPACING.logoSizeSlider;
							}
							break;
					}
					break;
				case "logo":
					switch (p_sGeTargetLink) {
						case 8:
							logoMakerFunction.resetSlider("logoTextSlider");
							logoMakerFunction.resetSlider("logoLetterSpacing");
							logoMakerFunction.resetSlider("sloganTextSize");
							if (newLogoObj.generate.templatePath.isEqual == 1 && newLogoObj.generate.templatePath.sloganSetAsPerText == 1) {
								logoMakerFunction.setSliderForSloganLetterSpacing(newLogoObj.generate.sloganLetterSpacing);
							} else {
								logoMakerFunction.resetSlider("sloganLetterSpacing");
							}

							if (newLogoObj.generate.templatePath.isDBLineCompanyText == "yes") {
								debugConsole("come here1");
								if (newLogoObj.generate.hasOwnProperty("logoText1Slider")) {
									delete newLogoObj.generate["logoText1Slider"];
								}
								if (newLogoObj.generate.hasOwnProperty("logoText2Slider")) {
									delete newLogoObj.generate["logoText2Slider"];
								}
								if (newLogoObj.generate.hasOwnProperty("logoText1LetterSpacing")) {
									delete newLogoObj.generate["logoText1LetterSpacing"];
								}
								if (newLogoObj.generate.hasOwnProperty("logoText2LetterSpacing")) {
									delete newLogoObj.generate["logoText2LetterSpacing"];
								}
							}
							parentDiv = $('.subChild-8').find(".company-text-font-box");
							workFor = parentDiv.attr("last_selected");
							debugConsole("workFor:=" + workFor);
							$('.subChild-8').find(".company-text-font-box").attr("last_selected", "");
							switch (workFor) {
								case "dd-ct-font-line1":
									editorUndoRedo.setUndoActData(LOGO_FONT1_CHANGE, oldLogoObj, newLogoObj);
									break;
								case "dd-ct-font-line2":
									editorUndoRedo.setUndoActData(LOGO_FONT2_CHANGE, oldLogoObj, newLogoObj);
									break;
								case "dd-ct-font-overall":
								default:
									editorUndoRedo.setUndoActData(LOGO_FONT_CHANGE, oldLogoObj, newLogoObj);
									break;
							}
							break;
					}
					break;
				case "slogan":
					switch (p_sGeTargetLink) {
						case 10:
							// logoMakerFunction.resetSlider("logoTextSlider");
							// logoMakerFunction.resetSlider("logoLetterSpacing");
							logoMakerFunction.resetSlider("sloganTextSize");
							if (newLogoObj.generate.templatePath.isEqual == 1 && newLogoObj.generate.templatePath.sloganSetAsPerText == 1) {
								logoMakerFunction.setSliderForSloganLetterSpacing(newLogoObj.generate.sloganLetterSpacing);
							} else {
								logoMakerFunction.resetSlider("sloganLetterSpacing");
							}
							// onTextSloganDistanceSlide($('.textSloganDistSlider'), oldLogoObj.generate.textSloganDistSlider, true);
							currLogo.generate.textSloganDistSlider = oldLogoObj.generate.textSloganDistSlider;
							editorUndoRedo.setUndoActData(SLOGAN_FONT_CHANGE, oldLogoObj, newLogoObj);
							break;
					}
					break;
			}

			var dataAnalysisObj = getDataAnalsyis(currLogo, false);
			obj.setSession('currentLogo', getValidJsonStringifyObj(currLogo));
			obj.currentLogo = currLogo;

			var logoId = obj.getCurrentLogoId();
			jqXHR = $.ajax({
				url: DH.baseURL + '/logoMakerAjax.php',
				type: 'POST',
				beforeSend: function () {
				},
				data: { action: 'save', logo_id: logoId, 'curr_logo': obj.validateJSON(obj.currentLogo, dataAnalysisObj), 'svg_logo': logoMakerFunction.getFinalLogoTemplate(obj.currentLogo.generate), data_analysis: dataAnalysisObj, exceptions: JSON.stringify(createLogging("on saveDefaultLogo")) },
				async: false,
				success: function (json) {
					json = getValidJsonParseObj(json);
					if (json.status == 0) {
						obj.alertMessages('error', json.msg);
					} else {
						obj.alertMessages('success', json.msg);
						obj.setCurrentLogoId(json.data.logo_id);
					}
					clearException();
				},
				error: function (jqXHR, textStatus, errorThrown) {
					//alert(errorThrown);
				}
			});
		}

		// gor getting svg of current logoo
		obj.getCurrentLogo = function () {
			debugConsole("getCurrentLogo");
			var html = logoMakerFunction.getFinalLogoTemplate(obj.currentLogo.generate);
			$('.finaLogoInner').html('<div class="svg--slide" style="background-color:' + obj.currentLogo.generate.bgColor + '; "><div class="svg-slide--content svgSlideContent"><div class="water-mark-img"></div>' + html + '</div></div>');

			if (!(typeof obj.getSession('boundary') == "undefined" || obj.getSession('boundary') == null)) {
				var boundary = getValidJsonParseObj(obj.getSession('boundary'));
				$('.svgSlideContent').append('<div class="svgBoderActive svg--outline" style="width:' + boundary.width + 'px; height:' + boundary.height + 'px; border:1px solid lime; left:' + boundary.left + 'px; z-index:11; top:' + boundary.top + 'px"></div>');

			}
		}

		// for showing preiview page
		obj.previewLogo = function (p_sStepType, p_oCurrentLogo, p_oParent) {
			debugConsole("previewLogo");
			//$("html, body").animate({ scrollTop: 0 });
			var currLogo = null;
			if (p_sStepType == "step6") {
				currLogo = p_oCurrentLogo;
				if (currLogo != null) {
					p_oParent.find('.previewLogoBox, .cardBG').css({ 'background-color': currLogo.generate.bgColor });
					p_oParent.find('.bagSvgBG svg g').attr('fill', currLogo.generate.bgColor);
					p_oParent.find('.logoImages').each(function () {
						p_oParent.find(this).html(logoMakerFunction.getFinalLogoTemplate(currLogo.generate));
					});
					if (currLogo.generate.templatePath.frameType == 'filled') {
						p_oParent.find('.logoImages').removeClass('noFilled');
					}
					else {
						p_oParent.find('.logoImages').addClass('noFilled');
					}
				}
			} else {
				currLogo = getValidJsonParseObj(obj.getSession('currentLogo'));
				if (currLogo != null) {
					$('.previewLogoBox, .cardBG').css({ 'background-color': currLogo.generate.bgColor });
					$('.bagSvgBG svg g').attr('fill', currLogo.generate.bgColor);
					$('.logoImages').each(function () {
						$(this).html(logoMakerFunction.getFinalLogoTemplate(currLogo.generate));
					});
					if (currLogo.generate.templatePath.frameType == 'filled') {
						$('.logoImages').removeClass('noFilled');
					}
					else {
						$('.logoImages').addClass('noFilled');
					}
				}
			}
		}

		// for getting current logo id	
		obj.getCurrentLogoId = function () {
			return obj.getSession('currLogoId');
		},

			// for setting current logo id
			obj.setCurrentLogoId = function (logoId) {
				obj.setSession('currLogoId', logoId);
			},

			// function for showing logo colors in preview page	
			obj.previewColors = function (p_sStepType, p_oCurrentLogo, p_oParent) {
				debugConsole("previewColors");

				var currLogo = null;
				var previewColorsPlatesDiv = null;
				if (p_sStepType == "step6") {
					currLogo = p_oCurrentLogo;
					previewColorsPlatesDiv = p_oParent.find('.previewColorsPlates');
				} else {
					currLogo = getValidJsonParseObj(obj.getSession('currentLogo'));
					previewColorsPlatesDiv = $('.previewColorsPlates');
				}
				previewColorsPlatesDiv.html('');
				previewColorsPlatesDiv.append('<div class="palette-desc"><div class="box box2 shadow"><div class="palette-head">Color Palette</div><div class="palette-para">Included in premium</div></div></div>');
				var arr = {};

				if (currLogo != null) {
					if (currLogo.generate.templatePath.isIconFrame == 1) {
						arr.iconFrame = { head: 'Inner Container', color: currLogo.generate.iconFrameColor, gradientType: currLogo.generate.iconFrameGradient };
					}

					if (currLogo.generate.templatePath.isFrame == 1) {
						if (currLogo.generate.templatePath.frameType == "filled") {
							arr.frame = { head: 'Filled Container', color: currLogo.generate.frameFilledColor, gradientType: currLogo.generate.frameFilledGradient };
						} else {
							arr.frame = { head: 'Container', color: currLogo.generate.frameColor, gradientType: currLogo.generate.frameGradient };
						}
					}


					if (currLogo.generate.templatePath.isIcon == 1) {
						arr.icon = { head: 'Symbol', color: currLogo.generate.iconColor, gradientType: currLogo.generate.iconGradient };
					}
					if (currLogo.generate.templatePath.isMono == 1) {
						arr.mono = { head: 'Monogram', color: currLogo.generate.iconColor, gradientType: currLogo.generate.iconGradient };
					}

					if (currLogo.generate.templatePath.isDBLineCompanyText == "yes") {
						if (currLogo.logoName1 != "") {
							arr.main = { head: 'Company Name', color: currLogo.generate.mainTextColor, gradientType: currLogo.generate.textGradient };
						}
						if (currLogo.logoName2 != "") {
							arr.main = { head: 'Company Name', color: currLogo.generate.mainText2Color, gradientType: currLogo.generate.text2Gradient };
						}
					} else {
						if (currLogo.logoName != "") {
							arr.main = { head: 'Company Name', color: currLogo.generate.mainTextColor, gradientType: currLogo.generate.textGradient };
						}
					}


					if (currLogo.sloganName != "") {
						arr.slogan = { head: 'Slogan', color: currLogo.generate.sloganTextColor, gradientType: currLogo.generate.sloganGradient };
					}

					arr.bg = { head: 'Background', color: currLogo.generate.bgColor, gradientType: '' };
					var colorPalette = {};
					var colorArr = [];
					var currColor = "";
					var i = j = k = 0;
					$.each(arr, function (k, v) {
						currColor = typeof v.gradientType == 'undefined' || v.gradientType == "" ? v.color : v.gradientType;
						if ($.inArray(currColor, colorArr) == -1) {
							colorArr.push(currColor);
						}
					});

					$.each(colorArr, function (k, v) {
						var ver = v;

						if (!gradientsArray[v]) {
							ver = v.substr(1);
						}
						colorPalette[ver] = [];
						$.each(arr, function (ke, ve) {

							currColor = typeof ve.gradientType == 'undefined' || ve.gradientType == "" ? ve.color : ve.gradientType;
							if (currColor == v) {
								colorPalette[ver].push('<span>' + ve.head + '</span>');
							}
						});
					});

					$.each(colorPalette, function (k, v) {
						if (gradientsArray[k]) {
							var colorObj = gradientsArray[k]
							var style = getGradientStyle(k);

							previewColorsPlatesDiv.append('<div class="preview-color-container"><div class="preview-bg" style="background:' + style + '"></div><div class="preview-color--boxes"><div class="color--boxes-center"><p class="color--name">' + colorObj.name + '</p><p>' + v.join(', ') + '</p></div></div></div>');
						}
						else {
							previewColorsPlatesDiv.append('<div class="preview-color-container"><div class="preview-bg" style="background-color:#' + k + ';"></div><div class="preview-color--boxes"><div class="color--boxes-center"><p class="color--name">#' + k + '</p><p>' + v.join(', ') + '</p></div></div></div>');

						}
					});
					$(".preview-color-container").wrapAll("<div class='pallet-wrap'></div>");
					if (p_sStepType == "step6") {
						if (p_oParent.find('.preview-color-container').length <= 4) {
							p_oParent.find('.preview-image-container-palete').addClass('mob-color-palete');
						} else {
							p_oParent.find('.preview-image-container-palete').removeClass('mob-color-palete');
						}
					} else {
						if ($('.preview-color-container').length <= 4) {
							$('.preview-image-container-palete').addClass('mob-color-palete');
						} else {
							$('.preview-image-container-palete').removeClass('mob-color-palete');
						}
					}
				}
				return colorPalette;

			}

		// for showing aler messages 	
		obj.alertMessages = function (type, msg) {
			var stripHeight = 0;
			if ($('.avail_offer').length > 0) {
				stripHeight = $('.avail_offer').height();
			}

			switch (type) {

				case 'success': {
					$('.step_7').append('<div class="commonNotification common-notification"><div class="spin circle notif notif-success"><div class="notify--text">' + msg + '</div></div></div>');
					break;
				}
				case 'error': {
					$('.step_7').append('<div class="commonNotification common-notification"><div class="spin circle notif notif-danger"><a href="javascript:;" class="iconCheck icons-check"> </a><div class="notify--text">' + msg + '</div></div></div>');
					break;
				}
				case 'warning': {
					$('.step_7').append('<div class="commonNotification common-notification"><div class="alert alert-warning text-left"><a href="javascript:;" class="iconCheck icons-check"> </a><div class="notify--text">' + msg + '</div></div></div>');
					break;
				}
			}
			setTimeout(function () { $('.commonNotification').addClass('active').css('top', stripHeight + 60 + "px"); }, 500);
			setTimeout(function () { $('.commonNotification .notif-success .notify--text').html('Saved'); }, 850);
			setTimeout(function () { $('.commonNotification').remove(); }, 3000);
		}

		return obj;
	})();
    /**
	 * load the recent colors on the basis of user previous selections
	 */
	function loadRecentColors() {
		jqXHR = $.ajax({
			url: DH.baseURL + '/logoMakerAjax.php',
			type: 'GET',
			data: { action: 'recent_colors' },
			dataType: "json",
			success: function (res) {
				if (res.status == 1) {
					recentColors = res.data;
					refreshRecentColorBox();
				}
			}
		});
	}
	/**
	 * save recent colors as user selects any color
	 * @param {*} color 
	 */
	function saveRecentColor(color) {
		jqXHR = $.ajax({
			url: DH.baseURL + '/logoMakerAjax.php',
			type: 'GET',
			data: { action: 'save_recent_colors', color: color },
			dataType: "json"
		});
	}
	/* editor bottom strip js */
	$('.getCurrentLogo').click(function (e) {
		debugConsole("getCurrentLogo click");
		e.stopImmediatePropagation();
		if ($(this).parents('.currentLogoContainer').hasClass('active')) {
			return;
		} else {
			$('.logoTab').removeClass('active');
			$('[data-tab=".currentLogoTab"]').addClass('active');
			$('.logosTabBox').removeClass('tabActive');
			$('.currentLogoTab').addClass('tabActive');
		}
		$('body,html').css({ "overflow": "hidden", "height": "100%" });
		$(this).removeClass('getCurrentLogo');
		$('.currentLogoContainer').addClass('active');
		$('.closeCurrentLogo, .expandLogo').show();

		var returnObj = logoMakerFunction.getFinalLogoTemplate(lEditor.currentLogo.generate);
		$('.innerlogo').html('<div class="svg--slide" style="background-color:' + lEditor.currentLogo.generate.bgColor + '; "><div class="logoSlide-overlay gradient-div"><a href="javascript:;" class="icons-edit setCurrentLogoDiv"><span>Update to this</span></a></div><div class="svg-slide--content svgSlideContent"><div class="water-mark-img"></div>' + returnObj + '<div class="bgOutlineBox bg-outline-box"></div></div></div>');
		dh_utility_common.changeBg();
	});
	$('body').on('click', '.currentLogoContainer.active, .closeCurrentLogo, .expandLogo', function (e) {
		debugConsole("closeCurrentLogo click");
		if ((!$(e.target).closest('.logosTabBox').length)) {
			$('body,html').css({ "overflow": "auto", "height": "auto" });
			$('.logoBottomDiv').addClass('getCurrentLogo');
			$(this).removeClass('active');
			$('.logosTabBox').removeClass('tabActive');
			$('.logoTab').removeClass('active');
			$('.logoTab:first').addClass('active');
			$('.closeCurrentLogo, .expandLogo').hide();
			$('.innerlogo').html('');
		}
	});
	$('.logoTab').click(function (e) {
		debugConsole("logoTab click");
		e.stopImmediatePropagation();
		var dataTarget = $(this).data('tab');
		if (dataTarget == ".shareTab") {
			$('.shareButton').trigger('click');
			return false;
		}

		if (dataTarget == ".savedLogoTab") {
			savedPagination = 0;
			$('.savedLogo').html('');
			getSavedLogoListing();
		}
		if (dataTarget == ".favoriteLogoTab") {
			favoritePagination = 0;
			$('.favoriteLogo').html('');
			getFavoriteLogoListing();
		}
		$('body,html').css({ "overflow": "hidden", "height": "100%" });
		$('.currentLogoContainer').addClass('active');
		$('.logoTab').removeClass('active');
		$(this).addClass('active');
		$('.closeCurrentLogo, .expandLogo').show();
		$('.logosTabBox').removeClass('tabActive');
		$(dataTarget).addClass('tabActive');
		var returnObj = logoMakerFunction.getFinalLogoTemplate(lEditor.currentLogo.generate);
		$('.innerlogo').html('<div class="svg--slide" style="background-color:' + lEditor.currentLogo.generate.bgColor + '; "><div class="logoSlide-overlay gradient-div"><a href="javascript:;" class="icons-edit setCurrentLogoDiv"><span>Update to this</span></a></div><div class="svg-slide--content svgSlideContent"><div class="water-mark-img"></div>' + returnObj + '<div class="bgOutlineBox bg-outline-box"></div></div></div>');
		dh_utility_common.changeBg();
	});

	$('.currentLogoContainer').on('click', '.setCurrentLogoDiv', function () {
		debugConsole("setCurrentLogoDiv click");
		$('.currentLogoContainer').removeClass('active');
		$('.logoTab').removeClass('active');
		$('.logosTabBox').removeClass('tabActive');
		$('.menu_1 ul li').removeClass('active');
		$('.logoTab:first-child').addClass('active');
		$('.commonEditSection').addClass('hidden');
		lEditor.setSession('targetlink', 2);
		lEditor.setSession('defaultlink', 7);
		lEditor.setSession('parentlink', 'undefined');
		$('body').removeAttr('style');
		$('.closeCurrentLogo, .expandLogo').hide();
		debugConsole("editLogoSteps2");
		lEditor.editLogoSteps();
		$('body,html').css({ "overflow": "auto", "height": "auto" });
	});

	$('.containerSection a.subMenu-42').click(function (e) {
		debugConsole("subMenu-42 click");
		$(this).parent('li').removeClass('active');
		$(this).parent('li').addClass('hidden');
		$('.cancelFrameContainer').parent('li').removeClass('hidden');
		$(".containerOptions").addClass('active');
		$('.containerFrameSlider').removeClass('hidden');

	});
	/**
	 * for checking frame available or not and set menu accordingly
	 * @param {*} p_nGetLink 
	 */
	function checkFrame(p_nGetLink) {
		debugConsole("checkFrame p_nGetLink:=" + p_nGetLink);
		var currLogo = lEditor.currentLogo;
		var isFrame = currLogo.generate.templatePath.isFrame;
		debugConsole("isFrame:=" + isFrame);
		if (isFrame == 0) {
			+
				$('.subMenu-23, .subMenu-42').parent('li').addClass('hidden');
			$('.subMenu-24').text('Add Outer Container');
			$('.containerFrameSlider').addClass('hidden');
			$(".containerOptions").addClass('active');
			$('.cancelFrameContainer').parent('li').addClass('hidden');
			$('.subMenu-42').parents('ul').removeClass('flex');

		} else {
			$('.subMenu-24').text('Edit Outer Container');
			$('.containerFrameSlider').removeClass('hidden');

			$('.cancelFrameContainer').parent('li').addClass('hidden');
			$('.subMenu-42').parents('ul').addClass('flex');

			if ($(".containerOptions").hasClass('active')) {
				$('.subMenu-42').parent('li').addClass('hidden');
				$('.containerFrameSlider').addClass('hidden');
				$('.cancelFrameContainer').parent('li').removeClass('hidden');
				$('.subMenu-42').parents('ul').removeClass('flex');
			}
			$('.frameSizeSlider').removeClass('disabled');

			if (p_nGetLink === 42) {
				$('.subMenu-23, .subMenu-42').parent('li').addClass('hidden');
			} else {
				$('.subMenu-23, .subMenu-42').parent('li').removeClass('hidden');
			}

		}

	}
	/**
	 * 
	 * @param {*} getLink 
	 */
	function showEditOuterContainer(getLink) {
		var isFrame = lEditor.currentLogo.generate.templatePath.isFrame;
		debugConsole("showEditOuterContainer getLink:=" + getLink + ",,,,isFrame:=" + isFrame);
		if (isFrame == 0) {
			$('.subMenu-23').parent('li').addClass('hidden');
			$('.subMenu-42').parent('li').addClass('hidden');
			$('.subMenu-42').parents('ul').removeClass('flex');

			$('.subMenu-24').text('Add Outer Container');

			$(".containerOptions").addClass('active');

			$('.cancelFrameContainer').parent('li').removeClass('hidden');

			$('.containerFrameSlider').addClass('hidden');

		} else {
			if (getLink == 42) {
				$('.subMenu-23').parent('li').addClass('hidden');
				$('.subMenu-42').parent('li').addClass('hidden');
				$('.subMenu-42').parents('ul').removeClass('flex');
				$(".containerOptions").addClass('active');
				$('.cancelFrameContainer').parent('li').removeClass('hidden');
				$('.containerFrameSlider').addClass('hidden');

			} else {
				$('.subMenu-23').parent('li').removeClass('hidden');
				$('.subMenu-42').parent('li').removeClass('hidden');
				$('.subMenu-42').parents('ul').addClass('flex');

				$('.subMenu-24').text('Edit Outer Container');

				$(".containerOptions").removeClass('active');

				$('.cancelFrameContainer').parent('li').addClass('hidden');

				$('.containerFrameSlider').removeClass('hidden');
			}

		}
	}
	$('.containerSection a.subMenu-44').click(function (e) {
		debugConsole("subMenu-44 click");
		$(this).parent('li').removeClass('active');
		$(this).parent('li').addClass('hidden');
		$('.cancelIconFrameContainer').parent('li').removeClass('hidden');
		$(".innerContainerOptions").addClass('active');
	});
    /**
	 * 
	 * @param {*} getLink 
	 */
	function showEditInnerContainer(getLink) {
		var isIconFrame = lEditor.currentLogo.generate.templatePath.isIconFrame;
		if (isIconFrame == 0) {
			$('.subMenu-40').text('Add Inner Container');

			$('.subMenu-41').parent('li').addClass('hidden');
			$('.subMenu-44').parent('li').addClass('hidden');

			$(".innerContainerOptions").addClass('active');

			$('.cancelIconFrameContainer').parent('li').removeClass('hidden');
		} else {
			if (getLink === 44) {
				$('.subMenu-41').parent('li').addClass('hidden');
				$('.subMenu-44').parent('li').addClass('hidden');

				$(".innerContainerOptions").addClass('active');

				$('.cancelIconFrameContainer').parent('li').removeClass('hidden');

			} else {
				$('.subMenu-40').text('Edit Inner Container');

				$('.subMenu-41').parent('li').removeClass('hidden');
				$('.subMenu-44').parent('li').removeClass('hidden');

				$(".innerContainerOptions").removeClass('active');

				$('.cancelIconFrameContainer').parent('li').addClass('hidden');
			}
		}
	}
	/**
	 * for checking icon frame available or not and set menu accordingly
	 */
	function checkIconFrame() {
		debugConsole("checkIconFrame");
		var currLogo = lEditor.currentLogo;
		var isIconFrame = currLogo.generate.templatePath.isIconFrame;

		if (isIconFrame == 0) {
			$('.subMenu-41, .subMenu-44').parent('li').addClass('hidden');
			$('.subMenu-40').text('Add Inner Container');
			$('.containerInnerFrameSlider').addClass('hidden');
			$(".innerContainerOptions").addClass('active');
			$('.cancelIconFrameContainer').parent('li').addClass('hidden');

		} else {
			$('.subMenu-40').text('Edit Inner Container');
			$('.containerInnerFrameSlider').removeClass('hidden');
			$('.subMenu-41, .subMenu-44').parent('li').removeClass('hidden');
			$('.cancelIconFrameContainer').parent('li').addClass('hidden');
			if ($(".innerContainerOptions").hasClass('active')) {
				$('.subMenu-44').parent('li').addClass('hidden');
				$('.containerInnerFrameSlider').addClass('hidden');
				$('.cancelIconFrameContainer').parent('li').removeClass('hidden');
				$('.subMenu-41').parent('li').addClass('hidden');
			}
			$('.frameSizeSlider').removeClass('disabled');


		}

	}
	$('.top-menu-click li a').on("mousedown", function (e) {
		debugConsole("common-nav li a' mousedown:=" + $(this).parent().hasClass("active"));
		lEditor.setSession('lastTargetlink', lEditor.getSession("targetlink"));
		lEditor.setSession('lastParentlink', lEditor.getSession("parentlink"));
		hideAllPopover();
	});


	$('.top-menu-click li a').click(function (e) {
		debugConsole("e:=" + e);
		e.stopImmediatePropagation();
		debugConsole("common-nav li a' click:=" + $(this).parent().hasClass("active"));
		debugConsole("common-nav li a' click class:=" + $(this).attr("class"));

		var targetLink = $(this).data('target');
		var parentLink = $(this).data('parent');
		var dataType = $(this).data('type');


		debugConsole("targetLink:=" + targetLink);
		debugConsole("parentLink:=" + parentLink);

		lEditor.setSession('targetlink', targetLink);
		lEditor.setSession('parentlink', parentLink);
		lEditor.setSession('colorDataType', dataType);

		lEditor.showNav($(this));
		var defaultKeys = { 1: 1, 2: 7, 3: 12, 4: 17, 5: 0, 6: 0, 11: 0 };
		if (typeof lEditor.currentLogo.generate.templatePath.isMono != 'undefiend' && lEditor.currentLogo.generate.templatePath.isMono != null && lEditor.currentLogo.generate.templatePath.isMono == 1) {
			defaultKeys[5] = 32;
		}
		if (typeof lEditor.currentLogo.generate.templatePath.isIcon != 'undefiend' && lEditor.currentLogo.generate.templatePath.isIcon != null && lEditor.currentLogo.generate.templatePath.isIcon == 1) {
			defaultKeys[5] = 31;
		}
		lEditor.setSession('defaultlink', defaultKeys[targetLink]);
		debugConsole("editLogoSteps3");
		lEditor.editLogoSteps();

	});
	// for edit monogram 
	$('.editMonogram').on('click', function () {
		var editMonogramInputText = $('.editMonogramText').val();
		lastMonogramText = lEditor.getMonogramText(true);
		if (editMonogramInputText === "") {
			debugConsole("input text is  blank");
			var logoText = lEditor.getSession('logoname');
			var MadeMonoGram = logoMakerFunction.genMonoGramText(logoText);
			$('.editMonogramText').val(MadeMonoGram);
			var sessionMonogGram = lEditor.getSession("monogram");
			if ((MadeMonoGram === sessionMonogGram) && sessionMonogGram) {
				debugConsole("made monogram " + MadeMonoGram + " and sessionMonogGram " + sessionMonogGram + "already displayed");
				return;
			}
		} else if (editMonogramInputText === lastMonogramText) {
			debugConsole("already displayed " + editMonogramInputText);
			return;
		}
		loadMoreStart = 0;
		// lEditor.setMonogramText($('.editMonogramText').val());
		lEditor.getMonogramVariations($('.editMonogramText').val());
	});
	// function called on onload	
	if (lEditor.getSession("edit_from") && lEditor.getSession("edit_from") == "favorite" || lEditor.getSession("edit_from") == "saved" || lEditor.getSession("edit_from") == "purchased") {
		debugConsole("coming from " + lEditor.getSession("edit_from"));
	} else {
		lEditor.showStep();
	}

	/**
	 * for edit monogram 
	 */
	$('.icons-selection-container').on('click', '.iconsHint', function () {
		debugConsole("icons-selection-container click");
		//Added for version 2
		if ($(this).hasClass('browse_cat_slug')) {
			$('.iconsHint:not(.recommend_tag)').removeClass('hidden');
			$(this).hide();
			return;
		}

		$('.icons-search-bar .error-text').hide();
		var slug = $(this).data('slug');
		var text = $(this).text();
		if (text.toLowerCase() == 'recommended') {
			text = slug.charAt(0).toUpperCase() + slug.slice(1);
		}
		$('#tags').val(text);
		lEditor.objIconPage = 1;
		lEditor.objIconSearch = slug;
		debugConsole("iconvalue7:+" + slug);
		// lEditor.setSession('iconValue', slug);
		lEditor.ajaxIconsResponse(slug, lEditor.objIconPage);
	});

	$('body').on('click', '.startIcoTab', function (e) {
		debugConsole("startIcoTab click");
		var target = $(e.target);
		var slug = $(this).data('tag');
		var searchBtn = target.closest('.step-holder').find('.logo-search-form .searchIcon');

		$('.icons-search-bar .error-text').hide();
		$('.startIcoTab').addClass('disabled');
		$('#tags').addClass('active');
		$('#tags').focus().click().val(slug);
		lEditor.objIconSearch = "";
		searchBtn.trigger('click');
	});
	$('#tags').on('input', function () {
		debugConsole("tags input");
		if ($(this).val() == '' || $(this).val() == null) {
			$(this).removeClass('active');
		}
	});

	$('body').on('click', '.hintIcoTab', function (e) {
		debugConsole("hintIcoTab click");
		var target = $(e.target);
		var slug = $(this).data('tag');
		if ($(window).width() < 991) {
			var searchBtn = target.closest('.mobile-selection').find('.logo-search-form .searchIcon');
			$('#mobile-icontags').addClass('active');
			$('#mobile-icontags').focus().click().val(slug);
		}
		else {
			var searchBtn = target.closest('.edit-strip').find('.logo-search-form .searchIcon');

			$('#icontags').addClass('active');
			$('#icontags').focus().click().val(slug);
		}
		$(this).addClass('active');
		$(this).parent().siblings().find('.hintIcoTab').removeClass('active');
		$(this).parent().siblings().removeClass('active');
		lEditor.objIconSearch = "";
		searchBtn.trigger('click');
	});

	$('#icontags, #mobile-icontags').on('input', function () {
		debugConsole("mobile-icontags input");
		if ($(this).val() == '' || $(this).val() == null) {
			$(this).removeClass('active');
		}
	});

	$('.brickImage').click(function () {
		debugConsole("brickImage click");
		$(this).addClass('hidden');
		$('.flipIconTag').removeClass('hidden');
		$('.startIcoTab').removeClass('disabled');
		$('.iconsContainerBox').addClass('hidden');
		$('.startIcoSection').removeClass('hidden');
		$('.iconsImages').remove();
		$('#tags').removeClass('active');
		$('#tags').val('');
	});

	$('body').on('click', '.searchIcon', function (e) {
		debugConsole("searchIcon click");
		e.stopPropagation();
		var target = $(e.target);
		var input = target.closest('.logo-search-form').find('input');
		lEditor.objIconSearch = "";
		lEditor.objIconPage = 1;
		if (removeMultipleSpaces($(input).val()) == '') {
			$('.error-text').show();
			$('.iconBlank').text(forSearchSymbol);
			return;
		}
		var iconValue = removeMultipleSpaces($(input).val());
		debugConsole("iconValue1111111:=" + iconValue);
		// lEditor.setSession('iconValue', iconValue);
		lEditor.iconsData(target);
	});


	$('body').on('click', '.editSearchButton', function (e) {
		debugConsole("editSearchButton click");
		onSymbolSearchClick();
	});
	function onSymbolSearchClick() {
		debugConsole("onSymbolSearchClick");
		var iconInputTextVal = removeMultipleSpaces($('.editTags').val());
		if ($('.finalogoSlider').children().length > 0 && $(".logos--boxes").length > 0 && $(".owl-carousel").length === 0 && (iconInputTextVal != "" && (iconInputTextVal == removeMultipleSpaces($('.editTags').attr("lastSearchIcon"))))) {
			forceConsoleAtStaging("no need to search icon " + iconInputTextVal + "! it's already displaying");
			return;
		}
		var currLogo = getValidJsonParseObj(lEditor.getSession('currentLogo'));
		var lastSearchIcon = "";
		debugConsole("currLogo.generate.iconName:=" + currLogo.generate.iconName);

		if (currLogo.generate.iconName && currLogo.generate.iconName != "") {
			lastSearchIcon = currLogo.generate.iconName;
			if (iconInputTextVal === "") {
				$('.editTags').val(lastSearchIcon);
			} else {
				lastSearchIcon = iconInputTextVal;
			}
		} else {
			lastSearchIcon = removeMultipleSpaces($('.editTags').val());
		}
		debugConsole("lastSearchIcon:=" + lastSearchIcon);
		debugConsole("searching " + lastSearchIcon + " icon");

		if (lastSearchIcon == "" && iconInputTextVal == "") {
			if ($('.iconBlank').length) {
				$('.iconBlank').text(forSearchSymbol);
			} else {
				$('.finalogoSlider').html('<div class="icons-blank result-option iconBlank">' + forSearchSymbol + '</div>');
			}
			debugConsole("asking for search the new icon");
			$('.editTags').val("");
			return;
		}
		if ($('.iconBlank').length) {
			$('.iconBlank').text(whileSearchingSymbol);
		} else {
			$('.finalogoSlider').html('<div class="icons-blank result-option iconBlank">' + whileSearchingSymbol + '</div>');
		}
		$('.icons-search-box, .icons-search-box-button').css("pointer-events", "none");
		loadMoreStart = 0;
		lEditor.editIconsData();
	}
	/**
	 * 
	 */
	function onSymbolSearchClick1() {
		debugConsole("onSymbolSearchClick");
		var currLogo = getValidJsonParseObj(lEditor.getSession('currentLogo'));
		var lastSearchIcon = "";
		debugConsole("currLogo.generate.iconName:=" + currLogo.generate.iconName);
		if (currLogo.generate.iconName && currLogo.generate.iconName != "") {
			lastSearchIcon = currLogo.generate.iconName;
		}
		// debugConsole("lastSearchIcon:="+lastSearchIcon);
		// var lastSearchIcon = lEditor.getSession("iconValue");
		debugConsole("lastSearchIcon:=" + lastSearchIcon);

		var tagValue = removeMultipleSpaces($('.editTags').val());
		debugConsole("tagValue:=" + tagValue);

		if ($('.finalogoSlider').children().length > 0 && $(".logos--boxes").length > 0 && $(".owl-carousel").length === 0) {
			var lastInputSearchIcon = $('.editTags').attr("lastSearchIcon");
			if (tagValue === "") {
				$('.editTags').val(lastInputSearchIcon);
				if (constantVars.ORIGINAL_SPACING.isJustChangeSloganLetterSpacing && currLogo.generate.templatePath.sloganSetAsPerText == 0 && currLogo.generate.templatePath.isEqual == 1) {
					debugConsole("searching icon due to slogan letter spacing change");
					constantVars.ORIGINAL_SPACING.isJustChangeSloganLetterSpacing = false;
					if ($('.iconBlank').length) {
						$('.iconBlank').text(whileSearchingSymbol);
					} else {
						$('.finalogoSlider').html('<div class="icons-blank result-option iconBlank">' + whileSearchingSymbol + '</div>');
					}
					debugConsole("searching " + tagValue + " icon");
					$('.icons-search-box, .icons-search-box-button').css("pointer-events", "none");
					loadMoreStart = 0;
					lEditor.editIconsData();
				} else {
					debugConsole("no need to search icon " + lastInputSearchIcon + " already displaying1");
					return;
				}
			} else {
				if (tagValue == lastInputSearchIcon) {
					debugConsole("no need to search icon " + tagValue + " already displaying2");
					return;
				} else {
					if ($('.iconBlank').length) {
						$('.iconBlank').text(whileSearchingSymbol);
					} else {
						$('.finalogoSlider').html('<div class="icons-blank result-option iconBlank">' + whileSearchingSymbol + '</div>');
					}
					debugConsole("searching " + tagValue + " icon");
					$('.icons-search-box, .icons-search-box-button').css("pointer-events", "none");
					loadMoreStart = 0;
					lEditor.editIconsData();
				}
			}
		} else {
			if (lastSearchIcon != null && lastSearchIcon != 'undefined' && lastSearchIcon !== "") {
				$('.editTags').val(lastSearchIcon);
				$('.editTags').attr("lastSearchIcon", lastSearchIcon);
				if ($('.iconBlank').length) {
					$('.iconBlank').text(whileSearchingSymbol);
				} else {
					$('.finalogoSlider').html('<div class="icons-blank result-option iconBlank">' + whileSearchingSymbol + '</div>');
				}
				debugConsole("searching " + lastSearchIcon + " icon");
				$('.icons-search-box, .icons-search-box-button').css("pointer-events", "none");
				loadMoreStart = 0;
				lEditor.editIconsData();
			} else {
				if (tagValue == "") {
					if ($('.iconBlank').length) {
						$('.iconBlank').text(forSearchSymbol);
					} else {
						$('.finalogoSlider').html('<div class="icons-blank result-option iconBlank">' + forSearchSymbol + '</div>');
					}
					debugConsole("asking for search the new icon");
					$('.editTags').val("");
				} else {
					if ($('.iconBlank').length) {
						$('.iconBlank').text(whileSearchingSymbol);
					} else {
						$('.finalogoSlider').html('<div class="icons-blank result-option iconBlank">' + whileSearchingSymbol + '</div>');
					}
					debugConsole("searching " + tagValue + " icon");
					$('.icons-search-box, .icons-search-box-button').css("pointer-events", "none");
					loadMoreStart = 0;
					lEditor.editIconsData();
				}
			}
		}
	}
	$('.tags').keyup(function (e) {
		debugConsole("tags keyup");
		if ($('.tags').val() != '') {
			$('.error-text').hide();
		}
	});

	$('body').on('click', '.iconContainerBoxes', function (e) {
		debugConsole("iconContainerBoxes click");
		lEditor.removeSelectedIcon($(this).index());
		lEditor.addSelectedIcon();
		$('.step_6 .load-more-anim').addClass('fixed');
		$('.step_6 .load-more-anim .loadMoreGenerate').addClass('animate');
		$('.ste-6-strip-apply').addClass('active');
	});

	$('body').on('click', '.iconEditContainerBoxes', function (e) {
		debugConsole("iconEditContainerBoxes click");
		lEditor.removeSelectedIcon($(this).index());
		lEditor.addSelectedIcon();
	});
	$('body').on('click', '.iconsImages', function (e) {
		debugConsole("iconsImages keyup");
		var iconName = $(this).data();
		$(this).addClass('active');
		lEditor.selectedIcons(iconName);
		lEditor.addSelectedIcon();
		$('.step_6 .load-more-anim').addClass('fixed');
		$('.step_6 .load-more-anim .loadMoreGenerate').addClass('animate');
		$('.ste-6-strip-apply').addClass('active')
	});

	$('body').on('click', '.loadMoreIconsV2', function (e) {
		debugConsole("loadMoreIconsV2 click");
		var target = $(e.target);
		if (typeof lEditor.getSession('currPage') != 'undefined' && lEditor.getSession('currPage') == '5') {
			if ($('.iconsParentDiv .iconsImages.hidden').length) {
				$('.iconsParentDiv .iconsImages').removeClass('hidden');
				if ($(this).data('more-icons') == '0') {
					$(this).addClass('hidden');
				}
			}
			else {
				$('.showIconsDiv .loadMoreIconsV2').html('<div class="text-center"><div class="cssload-container"><div class="cssload-speeding-wheel"></div></div></div>');
				lEditor.iconsData(target);
			}
		}

	});
	$('.step_6').on('click', '.logo-bottom-strip .bottom-right .common-btn.btn-edit', function (e) {
		debugConsole("bottom edit btn click");
		var numId = parseInt($(".step6-preview-section").find('.finaLogoInner').attr("currentid"));
		fromStep6EditLogo(numId, "edit", 0);
	});
	$('.step_6').on('click', '.logo-bottom-strip .bottom-right .common-btn.btn-buy', function (e) {
		debugConsole("bottom buy btn click");
		goForPurchase();
	});
	function higlightLogoSlides(p_bFirstTimeLoad, p_oThis) {
		if (p_bFirstTimeLoad) {
			step6SelectedLogoSlides = $(".step6-left-section").find(".step6-logo-section").find(".logo--slides").first();
		} else {
			step6SelectedLogoSlides = p_oThis.closest(".logo--slides");
		}
		step6SelectedLogoSlides.addClass("logo-selected");
	}
	//Current Logo Data JS Start
	$('.step_6').on('click', '.iconEdit .preview--btn', function (e) {
		debugConsole("preview-btn click");
		var numId = parseInt($(this).parents('.logo--slides').find('.iconEdit').data('id'));
		if (parseInt($(".step6-preview-section").find('.finaLogoInner').attr("currentid")) === numId) {
			debugConsole("same id click");
			return;
		}
		$(".step6-whole-section").css("pointer-events", "none");
		if (step6SelectedLogoSlides) {
			step6SelectedLogoSlides.removeClass("logo-selected");
			step6SelectedLogoSlides = null;
		}
		higlightLogoSlides(false, $(this));
		previewLogoAtStep6(numId, false);

	});
	/**
	 * 
	 */
	function initPopOver() {
		$('.btnNewPopover').on('shown.bs.popover', function () {
			$(this).addClass('popover-open');
			var show_popup_for = $(this).find('span').attr("show_popup_for");
			debugConsole("btnNewPopover shown:=" + show_popup_for);
			switch (show_popup_for) {
				case "edit_text":
					var line1Div = $(".dd-ct-line1.templateText");
					line1Div.on('blur', onLinesTextBlur);
					line1Div.on('input', onLinesTextInput);
					line1Div.on('keydown', onLinesTextKeyDown);
					line1Div.val(lEditor.currentLogo.logoName1);

					var line2Div = $(".dd-ct-line2.templateText");
					line2Div.on('blur', onLinesTextBlur);
					line2Div.on('input', onLinesTextInput);
					line2Div.on('keydown', onLinesTextKeyDown);
					line2Div.val(lEditor.currentLogo.logoName2);

					$('.lines-font-case').on("click", onLinesTextFontCase);

					if (lEditor.getSession('isEditable') == 1) {
						line1Div.attr('disabled', true);
						line2Div.attr('disabled', true);
						line1Div.css("background-color", "#d3d3d3");
						line2Div.css("background-color", "#d3d3d3");

					}
					break;
				case "edit_fs":
					setupLinesFSSlider();
					break;
				case "edit_ls":
					setupLinesLSSlider();
					break;
				case "change_font":
					setupFontChangeDropDown();
					break;
				case "change_color":
					setupColorChangeDropDown();
					break;
			}

			$("body").on("click", '.btnPopCancel', function () {
				hideAllPopover();
			});
		});
		// when popover's content is hidden
		$('.btnNewPopover').on('hide.bs.popover', function () {
			$(this).removeClass('popover-open');
			var show_popup_for = $(this).find('span').attr("show_popup_for");
			debugConsole("btnNewPopover hide:=" + show_popup_for);
			switch (show_popup_for) {
				case "edit_text":
					var line1Div = $(".dd-ct-line1.templateText");
					line1Div.on('blur');
					line1Div.on('input');
					line1Div.on('keydown');
					var line2Div = $(".dd-ct-line2.templateText");
					line2Div.on('blur');
					line2Div.on('input');
					line2Div.on('keydown');
					$('.lines-font-case').off("click");
					break;
				case "edit_fs":
					break;
				case "edit_ls":
					break;
				case "change_font":
					$('.dd-change-font-btn').off("click");
					break;
				case "change_color":
					$('.dd-change-color-btn').off("click");
					break;
			}
			$(".btnPopCancel").off("click");
			clearTimeout(inputTextTimer);
		});
	}
	initPopOver();
	/**
	 * 
	 */
	function hideAllPopover() {
		if ($('#edit_the_lines_text_dd').length && ($('#edit_the_lines_text_dd').attr("pop_over_shown") === "true")) {
			$('#edit_the_lines_text_dd').popover('hide');
			$('#edit_the_lines_text_dd').attr('pop_over_shown', 'false');
		}

		if ($('#edit_the_lines_fs_dd').length && ($('#edit_the_lines_fs_dd').attr("pop_over_shown") === "true")) {
			$('#edit_the_lines_fs_dd').popover('hide');
			$('#edit_the_lines_fs_dd').attr('pop_over_shown', 'false');
		}


		if ($('#edit_the_lines_ls_dd').length && ($('#edit_the_lines_ls_dd').attr("pop_over_shown") === "true")) {
			$('#edit_the_lines_ls_dd').popover('hide');
			$('#edit_the_lines_ls_dd').attr('pop_over_shown', 'false');
		}

		if ($('#edit_the_lines_font_change_dd').length && ($('#edit_the_lines_font_change_dd').attr("pop_over_shown") === "true")) {
			$('#edit_the_lines_font_change_dd').popover('hide');
			$('#edit_the_lines_font_change_dd').attr('pop_over_shown', 'false');
		}

		if ($('#edit_the_lines_color_change_dd').length && ($('#edit_the_lines_color_change_dd').attr("pop_over_shown") === "true")) {
			$('#edit_the_lines_color_change_dd').popover('hide');
			$('#edit_the_lines_color_change_dd').attr('pop_over_shown', 'false');
		}
		if (currentPopoverBtn) {
			currentPopoverBtn.removeClass('off');
			currentPopoverBtn = null;
		}
		clearTimeout(inputTextTimer);
	}
	/**
	 * 
	 * @param {*} e 
	 */
	function onLinesTextBlur(e) {
		debugConsole(".onLinesTextBlur");
		clearTimeout(inputTextTimer);
	}
	/**
	 * 
	 */
	function onLinesTextKeyDown() {
		debugConsole("onLinesTextKeyDown");
		clearTimeout(inputTextTimer);
		var workFor = $(this).attr("work-for");
		debugConsole("workFor:=" + workFor);
		var lastText = "";
		var currentText = "";
		switch (workFor) {
			case "dd-ct-line1":
				type = "logoName1";
				lastText = removeMultipleSpaces(lEditor.currentLogo.logoName1);
				break;
			case "dd-ct-line2":
				type = "logoName2";
				lastText = removeMultipleSpaces(lEditor.currentLogo.logoName2);
				break;
		}
		inputTextTimer = setTimeout(function () {
			currentText = removeMultipleSpaces($("." + workFor + ".templateText").val());
			if (currentText === lastText) {
				debugConsole("no need logo name1 or name2");
				return;
			}
			onLogoNameTextInput(type);
		}, inputTextTime)
	}
	/**
	 * 
	 */
	function onLinesTextInput() {
		var type = "";
		var workFor = $(this).attr("work-for");
		debugConsole("workFor:=" + workFor);
		switch (workFor) {
			case "dd-ct-line1":
				type = "logoName1";
				if (removeMultipleSpaces($(this).val()) === removeMultipleSpaces(lEditor.currentLogo.logoName1)) {
					debugConsole("no need logo name1");
					return;
				}
				break;
			case "dd-ct-line2":
				type = "logoName2";
				if (removeMultipleSpaces($(this).val()) === removeMultipleSpaces(lEditor.currentLogo.logoName2)) {
					debugConsole("no need logo name2");
					return;
				}
		}
		updateTextOnInput(type);
	}
	/**
	 * 
	 * @param {*} e 
	 */
	function onLinesTextFontCase(e) {
		e.stopImmediatePropagation();
		var textCase = $(this).text();
		textCase = textCase.toLowerCase();
		var workFor = $(this).attr("work-for");
		debugConsole("workFor:=" + workFor);
		debugConsole("e=" + e + ",,,," + e.target + ",,,," + e.currentTarget);
		var originalUpdateText = "";
		var updateText = "";
		switch (workFor) {
			case "dd-ct-line1":
				originalUpdateText = $('.dd-ct-line1.templateText').val();
				break;
			case "dd-ct-line2":
				originalUpdateText = $('.dd-ct-line2.templateText').val();
				break;
		}
		updateText = originalUpdateText;
		switch (textCase) {
			case 'caps':
				updateText = toCapitalize(updateText.toLowerCase());
				break;
			case 'up':
				updateText = updateText.toUpperCase();
				break;
			case 'low':
				updateText = updateText.toLowerCase();
				break;
		}
		debugConsole("originalUpdateText:=" + originalUpdateText);
		debugConsole("updateText:=" + updateText);
		if (originalUpdateText === updateText) {
			debugConsole("no need to convert logo");
			return;
		}
		if (lEditor.currentLogo.generate.templatePath.isEqual == 1 && typeof lEditor.currentLogo.generate.templatePath.sloganSetAsPerText != "undefined" && lEditor.currentLogo.generate.templatePath.sloganSetAsPerText == 1) {
			lEditor.currentLogo.generate.templatePath.sloganSetAsPerText = 0;
		}
		var logoTextFS = lEditor.currentLogo.generate.logoTextSlider;
		var logoTextLS = lEditor.currentLogo.generate.logoLetterSpacing;

		switch (workFor) {
			case "dd-ct-line1":
				if (lEditor.currentLogo.generate.logoText1Slider) {
					logoTextFS = lEditor.currentLogo.generate.logoText1Slider;
				}
				if (lEditor.currentLogo.generate.logoText1LetterSpacing) {
					logoTextLS = lEditor.currentLogo.generate.logoText1LetterSpacing;
				}
				updateLogoText("logoName1", textCase, logoTextFS, logoTextLS, 'layout');
				break;
			case "dd-ct-line2":
				if (lEditor.currentLogo.generate.logoText2Slider) {
					logoTextFS = lEditor.currentLogo.generate.logoText2Slider;
				}
				if (lEditor.currentLogo.generate.logoText2LetterSpacing) {
					logoTextLS = lEditor.currentLogo.generate.logoText2LetterSpacing;
				}
				updateLogoText("logoName2", textCase, logoTextFS, logoTextLS, 'layout');
				break;
		}
	}
	/**
	 * 
	 */
	function setupLinesFSSlider() {
		var overallTextFS = parseFloat(lEditor.currentLogo.generate.logoTextSlider);
		$('.logoOverallLinesFSSlider').slider({
			value: overallTextFS,
			min: 10,
			max: 100,
			stop: function (event, ui) {
				if ($('.logoOverallLinesFSSlider').attr('sliding') === "yes") {
					saveSliderData();
					editorUndoRedo.setUndoActData(LOGO_TEXT_FS, editorUndoRedo.ltsOldLogoObj, editorUndoRedo.ltsNewLogoObj);
				}
				$('.logoOverallLinesFSSlider').attr("sliding", "no");
			},
			start: function (event, ui) {
				editorUndoRedo.ltsOldLogoObj = null;
				editorUndoRedo.ltsOldLogoObj = getValidJsonParseObj(lEditor.getSession('currentLogo'));
				debugConsole(" start ui.value:=" + ui.value);
			},
			slide: function (event, ui) {
				debugConsole(" slide ui.value:=" + ui.value);
				$('.logoOverallLinesFSSlider').attr("sliding", "yes");
				onTextFontSizeSlide($(this), ui.value);
			}
		});
		updateLinesFSSlider("logoOverallLinesFSSlider", overallTextFS);
		//------------------------------------------------------------
		var line1TextFS = (lEditor.currentLogo.generate.logoText1Slider) ? parseFloat(lEditor.currentLogo.generate.logoText1Slider) : overallTextFS;
		$('.logoLine1FSSlider').slider({
			value: line1TextFS,
			min: 10,
			max: 100,
			stop: function (event, ui) {
				if ($('.logoLine1FSSlider').attr('sliding') === "yes") {
					saveSliderData();
					editorUndoRedo.setUndoActData(LOGO_TEXT1_FS, editorUndoRedo.ltsOldLogoObj, editorUndoRedo.ltsNewLogoObj);
				}
				$('.logoLine1FSSlider').attr("sliding", "no");
			},
			start: function (event, ui) {
				editorUndoRedo.ltsOldLogoObj = null;
				editorUndoRedo.ltsOldLogoObj = getValidJsonParseObj(lEditor.getSession('currentLogo'));
				debugConsole(" start ui.value:=" + ui.value);
			},
			slide: function (event, ui) {
				debugConsole(" slide ui.value:=" + ui.value);
				$('.logoLine1FSSlider').attr("sliding", "yes");
				onTextFontSizeSlide($(this), ui.value);
			}
		});
		updateLinesFSSlider("logoLine1FSSlider", line1TextFS);
		//---------------------------------------------------
		var line2TextFS = (lEditor.currentLogo.generate.logoText2Slider) ? parseFloat(lEditor.currentLogo.generate.logoText2Slider) : overallTextFS;
		$('.logoLine2FSSlider').slider({
			value: line2TextFS,
			min: 10,
			max: 100,
			stop: function (event, ui) {
				if ($('.logoLine2FSSlider').attr('sliding') === "yes") {
					saveSliderData();
					editorUndoRedo.setUndoActData(LOGO_TEXT2_FS, editorUndoRedo.ltsOldLogoObj, editorUndoRedo.ltsNewLogoObj);
				}
				$('.logoLine2FSSlider').attr("sliding", "no");
			},
			start: function (event, ui) {
				editorUndoRedo.ltsOldLogoObj = null;
				editorUndoRedo.ltsOldLogoObj = getValidJsonParseObj(lEditor.getSession('currentLogo'));
				debugConsole(" start ui.value:=" + ui.value);
			},
			slide: function (event, ui) {
				debugConsole(" slide ui.value:=" + ui.value);
				$('.logoLine2FSSlider').attr("sliding", "yes");
				onTextFontSizeSlide($(this), ui.value);
			}
		});
		updateLinesFSSlider("logoLine2FSSlider", line2TextFS);
	}
	/**
	 * 
	 */
	function setupLinesLSSlider() {
		var overallTextLS = parseFloat(lEditor.currentLogo.generate.logoLetterSpacing);
		$('.logoOverallLinesLSSlider').slider({
			value: overallTextLS,
			min: 1,
			step: 0.5,
			max: 10,
			stop: function (event, ui) {
				if ($('.logoOverallLinesLSSlider').attr('sliding') === "yes") {
					saveSliderData();
					editorUndoRedo.setUndoActData(LOGO_TEXT_LS, editorUndoRedo.llsOldLogoObj, editorUndoRedo.llsNewLogoObj);
				}
				$('.logoOverallLinesLSSlider').attr("sliding", "no");
			},
			start: function (event, ui) {
				editorUndoRedo.llsOldLogoObj = null;
				editorUndoRedo.llsOldLogoObj = getValidJsonParseObj(lEditor.getSession('currentLogo'));
			},
			slide: function (event, ui) {
				$('.logoOverallLinesLSSlider').attr("sliding", "yes");
				onTextLetterSpacingSlide($(this), ui.value);
			}
		});
		updateLinesLSSlider("logoOverallLinesLSSlider", overallTextLS);
		var line1TextLS = parseFloat(lEditor.currentLogo.generate.logoText1LetterSpacing) ? parseFloat(lEditor.currentLogo.generate.logoText1LetterSpacing) : overallTextLS;
		$('.logoLine1LSSlider').slider({
			value: line1TextLS,
			min: 1,
			step: 0.5,
			max: 10,
			stop: function (event, ui) {
				if ($('.logoLine1LSSlider').attr('sliding') === "yes") {
					saveSliderData();
					editorUndoRedo.setUndoActData(LOGO_TEXT1_LS, editorUndoRedo.llsOldLogoObj, editorUndoRedo.llsNewLogoObj);
				}
				$('.logoLine1LSSlider').attr("sliding", "no");
			},
			start: function (event, ui) {
				editorUndoRedo.llsOldLogoObj = null;
				editorUndoRedo.llsOldLogoObj = getValidJsonParseObj(lEditor.getSession('currentLogo'));
			},
			slide: function (event, ui) {
				$('.logoLine1LSSlider').attr("sliding", "yes");
				onTextLetterSpacingSlide($(this), ui.value);
			}
		});
		updateLinesLSSlider("logoLine1LSSlider", line1TextLS);

		var line2TextLS = parseFloat(lEditor.currentLogo.generate.logoText2LetterSpacing) ? parseFloat(lEditor.currentLogo.generate.logoText2LetterSpacing) : overallTextLS;

		$('.logoLine2LSSlider').slider({
			value: line2TextLS,
			min: 1,
			step: 0.5,
			max: 10,
			stop: function (event, ui) {
				if ($('.logoLine2LSSlider').attr('sliding') === "yes") {
					saveSliderData();
					editorUndoRedo.setUndoActData(LOGO_TEXT2_LS, editorUndoRedo.llsOldLogoObj, editorUndoRedo.llsNewLogoObj);
				}
				$('.logoLine2LSSlider').attr("sliding", "no");
			},
			start: function (event, ui) {
				editorUndoRedo.llsOldLogoObj = null;
				editorUndoRedo.llsOldLogoObj = getValidJsonParseObj(lEditor.getSession('currentLogo'));
			},
			slide: function (event, ui) {
				$('.logoLine2LSSlider').attr("sliding", "yes");
				onTextLetterSpacingSlide($(this), ui.value);
			}
		});
		updateLinesLSSlider("logoLine2LSSlider", line2TextLS);
	}
	/**
	 * 
	 */
	function setupFontChangeDropDown() {
		$('.dd-change-font-overall-text').text(lEditor.currentLogo.logoName);
		$('.dd-change-font-line1-text').text(lEditor.currentLogo.logoName1);
		$('.dd-change-font-line2-text').text(lEditor.currentLogo.logoName2);
		$('.dd-change-font-btn').on("click", onLinesTextFontChange);
		var lastSelValue = $('.subChild-8').find(".company-text-font-box").attr("last_selected");
		if (lastSelValue && lastSelValue != "") {
			$(".dd-change-font-btn[work-for='" + lastSelValue + "']").addClass('active');
		} else {
			$('.dd-change-font-overall-text').addClass('active');
		}
	}
	/**
	 * 
	 * @param {*} e 
	 */
	function onLinesTextFontChange(e) {
		debugConsole("onLinesTextFontChange");
		$(".dd-change-font-btn").removeClass("active");
		$(this).addClass('active');
		var objs = $('.textFontFamily a:first');
		$('.commonFont a').removeClass('active');
		$(objs).addClass('active');
		$('.subChild-8').find(".company-text-font-box").attr("last_selected", $(this).attr("work-for"));
		editorParameters = {};
		editorParameters.obj = objs;
		editorParameters.fors = 'logo';
		loadMoreStart = 0;
		logoByfontFamily(editorParameters);
	}
	/**
	 * 
	 */
	function setupColorChangeDropDown() {
		$('.dd-change-color-overall-text').text(lEditor.currentLogo.logoName);
		$('.dd-change-color-line1-text').text(lEditor.currentLogo.logoName1);
		$('.dd-change-color-line2-text').text(lEditor.currentLogo.logoName2);
		$('.dd-change-color-btn').on("click", onLinesTextColorChange);
		var lastSelValue = $('.subChild-13').find(".company-text-color-box").attr("last_selected");
		if (lastSelValue && lastSelValue != "") {
			$(".dd-change-color-btn[work-for='" + lastSelValue + "']").addClass('active');
		} else {
			$('.dd-change-color-overall-text').addClass('active');
		}
	}
	/**
	 * 
	 * @param {*} e 
	 */
	function onLinesTextColorChange(e) {
		$(".dd-change-color-btn").removeClass("active");
		$(this).addClass('active');
		$('.subChild-13').find(".company-text-color-box").attr("last_selected", $(this).attr("work-for"));
		switch ($(this).attr("work-for")) {
			case "dd-ct-color-line1":
			case "dd-ct-color-overall":
				editorParameters = {};
				$('.commonClrDiv a').removeClass('active');
				$(".editLogoSlider").addClass("hidden");
				$(".editFinalLogo, .previewSection").removeClass("hidden");
				updateColorPickerValue(lEditor.currentLogo.generate.mainTextColor, false, "", 0);
				$('.finalogoSlider').html('');
				break;
			case "dd-ct-color-line2":
				editorParameters = {};
				$('.commonClrDiv a').removeClass('active');
				$(".editLogoSlider").addClass("hidden");
				$(".editFinalLogo, .previewSection").removeClass("hidden");
				updateColorPickerValue(lEditor.currentLogo.generate.mainText2Color, false, "", 0);
				$('.finalogoSlider').html('');
				break;
		}
	}
	/**
	 * 
	 * @param {*} p_nNum 
	 */
	function previewLogoAtStep6(p_nNum, p_bFirstTimeLoad) {
		// alert("1111")
		var currentPreviewLogo = lEditor.logoTempArr[p_nNum];

		var html = logoMakerFunction.getFinalLogoTemplate(currentPreviewLogo.generate);
		$(".step6-preview-section").find('.finaLogoInner').html('<div class="svg--slide" style="background-color:' + currentPreviewLogo.generate.bgColor + '; "><div class="svg-slide--content svgSlideContent"><div class="water-mark-img"></div>' + html + '</div></div>');

		$(".logo-bottom-strip").find('.bottom-logo-img').html('<div class="svg--slide" style="background-color:' + currentPreviewLogo.generate.bgColor + '; "><div class="svg-slide--content svgSlideContent"><div class="water-mark-img"></div>' + html + '</div></div>');

		$(".step6-preview-section").find('.finaLogoInner').attr('currentid', p_nNum);

		lEditor.previewColors("step6", currentPreviewLogo, $(".step6-preview-section"));
		lEditor.previewLogo("step6", currentPreviewLogo, $(".step6-preview-section"));
		debugConsole("scrollTop:=" + $(".step6-preview-section").scrollTop() + ",,,," + $('html').height());
		if ($(".step6-preview-section").scrollTop() > 150) {
			$(".step6-preview-section").animate({
				scrollTop: 0
			}, { duration: 'fast', easing: 'linear' });
		}
		if (p_bFirstTimeLoad) {
			$(".step6-preview-section").find('.finalogo--inner-wait').addClass("hidden");
			$(".step6-preview-section").find('.finaLogoInner').removeClass("hidden");
			$(".step6-preview-section").find('.flex-container').removeClass("hidden");
			$(".logo-bottom-strip").removeClass("hidden");
			$(".preview--btn").css("pointer-events", "auto");
			$('.logo-bottom-strip .bottom-right .common-btn').removeClass("disabled");
			if ($('.bottomStripLogo').length > 0) {
				var bottomspace = $('.bottomStripLogo').height() + 15;
				$('.paddingForStrip').css('padding-bottom', bottomspace);
			}
		} else {
			$(".step6-whole-section").css("pointer-events", "auto");
		}
	}


	if (version == "v6") {
		$('.step_6').on('click', '.iconEdit .edit--btn', function (e) {
			fromStep6EditLogo(parseInt($(this).parents('.logo--slides').find('.iconEdit').data('id')), $(this).parents('.logo--slides').find('.iconEdit').data('type'), $(this).parents('.logo--slides').find('.iconEdit').attr('data-logo-id'))
		});
	} else {
		$('.step_6').on('click', '.iconEdit.edit--btn', function (e) {
			debugConsole("normal case");
			fromStep6EditLogo(parseInt($(this).parents('.logo--slides').find('.iconEdit').data('id')), $(this).parents('.logo--slides').find('.iconEdit').data('type'), $(this).parents('.logo--slides').find('.iconEdit').attr('data-logo-id'))
		});
	}


	/**
	 * 
	 * @param {*} p_nDataId 
	 * @param {*} p_sDataType 
	 * @param {*} p_sDataLogoId 
	 */
	function fromStep6EditLogo(p_nDataId, p_sDataType, p_sDataLogoId) {
		if (DH.isLogged == 0 && DH.userId == 0) {
			clearTimeout(loginPopupTimer);
			userLoginPopup();
			// $('body').addClass('logo-modal-unset');
			return;
		}
		// $('.step_6 .load-more-anim').addClass('hidden');
		lEditor.currentLogo = {};

		debugConsole("data id:=" + p_nDataId);
		debugConsole("lEditor.logoTempArr:=" + lEditor.logoTempArr.length);
		debugConsole("p_sDataLogoId:=" + p_sDataLogoId);

		lEditor.currentLogo = lEditor.logoTempArr[p_nDataId];

		lEditor.currentStep = 7;
		sessionStorage.setItem("prevPage", 7);
		if (lEditor.currentLogo.generate && lEditor.currentLogo.generate.sloganFontObject != '') {
			lEditor.currentLogo.generate.sloganFontObject = '';
		}

		var dataAnalysisObj = getDataAnalsyis(lEditor.currentLogo, true);
		lEditor.setSession('currentLogo', getValidJsonStringifyObj(lEditor.currentLogo));
		lEditor.setSession('currPage', lEditor.currentStep);
		lEditor.setSession('coming_from', "step6_edit");
		// lEditor.setSession('edit_in_new_tab', "yes");
		var type = p_sDataType
		var curLogoId = p_sDataLogoId



		jqXHR = $.ajax({
			url: DH.baseURL + '/logoMakerAjax.php',
			type: 'POST',
			beforeSend: function () {
				$('#loadere').show();
			},
			data: { action: 'save', logo_id: curLogoId, 'curr_logo': lEditor.validateJSON(lEditor.currentLogo, dataAnalysisObj), 'svg_logo': logoMakerFunction.getFinalLogoTemplate(lEditor.currentLogo.generate), data_analysis: dataAnalysisObj, exceptions: JSON.stringify(createLogging("step_6 on click")) },
			success: function (json) {
				$('#loadere').hide();
				json = getValidJsonParseObj(json);
				if (json.status == 0) {
				} else {
					lEditor.showStep();
					$('.step_6 .logoSlider').trigger("destroy.owl.carousel");
					$('.step_6 .owl-carousel').remove();
					lEditor.setCurrentLogoId(json.data.logo_id);
					if (type == 'purchase') {
						window.location.href = DH.baseURL + '/tools/logo-maker/payment?logoid=' + json.data.logo_id * 11 + "" + qrStr;
					} else {
						window.location.href = DH.baseURL + '/tools/logo-maker?editor=' + json.data.logo_id * 11 + "" + qrStr;
					}
					// var newUrl = DH.baseURL + '/tools/logo-maker?editor=' + json.data.logo_id * 11 + "" + qrStr;
					// window.open(newUrl, '_blank');
				}
				clearException();
			},
			error: function (jqXHR, textStatus, errorThrown) {
			}
		});
	}
	//Current Logo Data JS End
	$('.flipIconTag').click(function () {
		getIconTagListing(0);
	});
	$('body').on('keypress', '#icontags, #tags', '#mobile-icontags', function (e) {
		const target = $(e.target);
		const key = e.which;
		const button = target.closest('.logo-search-form').find('button');

		if (key == 13) {
			button.trigger('click');
		}

		debugConsole("keypress");
	});
	$('#editLogoNameText').focus(function (e) {
		debugConsole("editLogoNameText focus");
		var textVal = removeMultipleSpaces($(this).val());
		$(this).attr("lastvalue", textVal);
	});
	$('#editLogoNameText').blur(function (e) {
		debugConsole("editLogoNameText focus");
		$(this).attr("lastvalue", " ");
	});
	$('#editLogoNameText').on('keyup', function (e) {
		// step 6 textfiled
		debugConsole("editLogoNameText keyup");
		var key = e.which;

		if (key == 13) {
			e.stopPropagation();
			return;
		}
		var textVal = removeMultipleSpaces($(this).val());
		if (textVal == '') {
			$(this).val(lEditor.getSession('logoname'));
			return false;
		}
		lEditor.setSession('logoname', textVal);
		clearTimeout(editorTimer);
		editorTimer = setTimeout(function () {
			lEditor.modifyLogoProperties("logoname");
		}, 1500);
	});

	$('#editSloganNameText').on('keyup', function (e) {
		debugConsole("editSloganNameText keyup");
		var key = e.which;

		if (key == 13) {
			e.stopPropagation();
			return;
		}
		var sloganText = removeMultipleSpaces($(this).val());
		debugConsole("getSession:=" + lEditor.getSession('sloganText'));
		if (removeMultipleSpaces(lEditor.getSession('sloganText')) == "" && sloganText == "") {
			$('#editSloganNameText').prop("value", "");
			return;
		}
		if (sloganText == "") {
			$('#editSloganNameText').prop("value", "");
			// return;
		}
		lEditor.setSession('sloganText', sloganText);
		clearTimeout(editorTimer);
		editorTimer = setTimeout(function () {
			lEditor.modifyLogoProperties("sloganText");
		}, 1500);
	});

	$('.color-selection.colorContainer .system-color').click(function (e) {
		debugConsole("system-color click");
		const target = $(e.target);
		const colorId = $(target).attr('data-samplecolorid');
		let selectedColors = getValidJsonParseObj(lEditor.getSession('sampleColor'));
		const index = selectedColors.findIndex(item => item.samplecolorid == colorId);
		const colorBoxes = $('.color-selection.colorContainer .color');

		if (index > -1) {
			selectedColors.splice(index, 1);
			target.removeClass('active');
		}
		else {
			const multiColorIndex = selectedColors.findIndex(item => item.samplecolorid == -1);

			if (colorId == -1 || multiColorIndex > -1) {
				selectedColors = [{ samplecolorid: colorId }];
			}
			else {
				selectedColors.unshift({ samplecolorid: colorId });
			}
		}
		lEditor.setSession('sampleColor', getValidJsonStringifyObj(selectedColors));


		colorBoxes.removeClass('active');
		lEditor.refreshSelectedColorBox();
		$('.step_6 .load-more-anim').addClass('fixed');
		$('.step_6 .load-more-anim .loadMoreGenerate').addClass('animate');
		$('.ste-6-strip-apply').addClass('active');
	});

	$('body').on('click', '.color-section .icons-container-box.colorContainerBoxes .delete-icon', function (e) {
		debugConsole("color-section click");
		const target = $(e.target);
		const selectedColors = getValidJsonParseObj(lEditor.getSession('sampleColor'));
		const sampleColorId = target.closest('.colorContainerBoxes').attr('data-samplecolorid');

		if (sampleColorId) {
			const index = selectedColors.findIndex(item => item.samplecolorid == sampleColorId);
			const systemColor = $('.color-selection.colorContainer .system-color[data-samplecolorid="' + sampleColorId + '"]');

			selectedColors.splice(index, 1);
			lEditor.setSession('sampleColor', getValidJsonStringifyObj(selectedColors));
			lEditor.refreshSelectedColorBox();
			target.removeClass('active');
			systemColor.removeClass('active');
			$('.step_6 .load-more-anim').addClass('fixed');
			$('.step_6 .load-more-anim .loadMoreGenerate').addClass('animate');
			$('.ste-6-strip-apply').addClass('active');
		}
	});

	$('.getStarted').click(function (e) {
		debugConsole("getStarted click");

		sessionData();
		var lPage = lEditor.getSession('currPage');
		$("html, body").animate({ scrollTop: 0 });
		$(this).trigger("blur");
	});

	$('.backButton').click(function (e) {
		debugConsole("backButton click");
		var currentPage = parseInt(lEditor.getSession('currPage'));
		lEditor.currentStep--;
		if (lEditor.currentStep == 6) {
			window.location.href = $(this).attr('data-link');
			return
		}
		lEditor.setSession('currPage', lEditor.currentStep);
		$("html, body").animate({ scrollTop: 0 });
		$('.hide--icons').remove();
		$('#tags').val('');
		$('.commonFont a').removeClass('active');
		$('.startIcoSection').removeClass('hidden');
		$('.startIcoTab').removeClass('disabled');
		$('.loadMoreIcons, .iconsContainerBox, .brickImage').addClass('hidden');
		$('.flipIconTag').removeClass('hidden');
		lEditor.showStep();
	});

	$('.btnSkip').click(function (e) {
		debugConsole("backBubtnSkiptton click");
		var currentPage = parseInt(lEditor.getSession('currPage'));
		lEditor.currentStep++;
		lEditor.setSession('currPage', lEditor.currentStep);
		if (currentPage == 3) {
			lEditor.setSession('sampleColor', getValidJsonStringifyObj([]));
		} else if (currentPage == 5) {
			lEditor.sampleIconArr = [];
			lEditor.setSession('sampleIcon', getValidJsonStringifyObj({ "si": '' }));
		}
		$("html, body").animate({ scrollTop: 0 });
		lEditor.showStep();
	});

	$('.startButton').click(function (e) {
		lEditor.startNew();

	});
	$('.editCompanyName').val(lEditor.getSession('logoname'));

	/* Step Two JS */
	$('body').on('click', '.le-imageLayout', function () {
		debugConsole("imageLayout click");
		var boxLength = lEditor.imgLength();
		if (boxLength == 0) {
			$('.footer-strip-content .progress').css('float', 'none');
			$('.footer-strip-content .progress').addClass('mob-progress');
		}
		switch (lEditor.currentStep) {
			case 2: {
				lEditor.progressBar(boxLength);
				break;
			}
			case 5:
			case 3: {
				lEditor.skipBtn(boxLength);
				break;
			}
		}

	});

	$('.editShowIconsDiv').scroll(function (e) {
		var element = e.target;
		if ((element.scrollHeight - element.scrollTop) === element.clientHeight) {
			if (lEditor.nextIconSearch == true) {
				lEditor.editIconsData();
			}
		}
	});

	$('.showIconsDiv').scroll(function (e) {
		var element = e.target;
		if ((element.scrollHeight - element.scrollTop) === element.clientHeight) {
			if (lEditor.nextIconSearch == true) {
				lEditor.iconsData($(element));
			}
		}
	});

	function setupSliders(objGenerate) {
		debugConsole("setupSliders");
		// company name font size slider code
		$('.logoTextSlider').slider({
			value: getSliderBarValueFirstTime(objGenerate.generate, 'logoTextSlider'),
			min: 10,
			max: 100,
			stop: function (event, ui) {
				if ($('.logoTextSlider').attr('sliding') === "yes") {
					saveSliderData();
					editorUndoRedo.setUndoActData(LOGO_TEXT_FS, editorUndoRedo.ltsOldLogoObj, editorUndoRedo.ltsNewLogoObj);
				}
				$('.logoTextSlider').attr("sliding", "no");
			},
			start: function (event, ui) {
				editorUndoRedo.ltsOldLogoObj = null;
				editorUndoRedo.ltsOldLogoObj = getValidJsonParseObj(lEditor.getSession('currentLogo'));
				debugConsole(" start ui.value:=" + ui.value);
			},
			slide: function (event, ui) {
				debugConsole(" slide ui.value:=" + ui.value);
				$('.logoTextSlider').attr("sliding", "yes");
				onTextFontSizeSlide($(this), ui.value);
			}
		});
		// company name letter spacing slider code 
		$('.logoLetterSpacing').slider({
			value: getSliderBarValueFirstTime(objGenerate.generate, 'logoLetterSpacing'),
			min: 1,
			step: 0.5,
			max: 10,
			stop: function (event, ui) {
				if ($('.logoLetterSpacing').attr('sliding') === "yes") {
					saveSliderData();
					editorUndoRedo.setUndoActData(LOGO_TEXT_LS, editorUndoRedo.llsOldLogoObj, editorUndoRedo.llsNewLogoObj);
				}
				$('.logoLetterSpacing').attr("sliding", "no");
			},
			start: function (event, ui) {
				editorUndoRedo.llsOldLogoObj = null;
				editorUndoRedo.llsOldLogoObj = getValidJsonParseObj(lEditor.getSession('currentLogo'));
			},
			slide: function (event, ui) {
				$('.logoLetterSpacing').attr("sliding", "yes");
				onTextLetterSpacingSlide($(this), ui.value);
			}
		});
		// slogan name font size slider code	
		$('.sloganTextSize').slider({
			value: getSliderBarValueFirstTime(objGenerate.generate, 'sloganTextSize'),
			min: 10,
			max: 100,
			stop: function (event, ui) {
				if ($('.sloganTextSize').attr('sliding') === "yes") {
					// logoMakerFunction.resetSlider("textSloganDistSlider", true);
					saveSliderData();
					editorUndoRedo.setUndoActData(SLOGAN_TEXT_FS, editorUndoRedo.stsOldLogoObj, editorUndoRedo.stsNewLogoObj);
				}
				$('.sloganTextSize').attr("sliding", "no");
			},
			start: function (event, ui) {
				editorUndoRedo.stsOldLogoObj = null;
				editorUndoRedo.stsOldLogoObj = getValidJsonParseObj(lEditor.getSession('currentLogo'));
			},
			slide: function (event, ui) {
				$('.sloganTextSize').attr("sliding", "yes");
				onSloganFontSizeSlide($(this), ui.value);
			}
		});
		// slogan letter spacing slider code 	
		$('.sloganLetterSpacing').slider({
			value: getSliderBarValueFirstTime(objGenerate.generate, 'sloganLetterSpacing'),
			min: 0,
			max: 100,
			stop: function (event, ui) {
				if ($('.sloganLetterSpacing').attr('sliding') === "yes") {
					// logoMakerFunction.resetSlider("textSloganDistSlider", true);
					saveSliderData();
					editorUndoRedo.setUndoActData(SLOGAN_TEXT_LS, editorUndoRedo.slsOldLogoObj, editorUndoRedo.slsNewLogoObj);
				}
				$('.sloganLetterSpacing').attr("sliding", "no");
			},
			start: function (event, ui) {
				editorUndoRedo.slsOldLogoObj = null;
				editorUndoRedo.slsOldLogoObj = getValidJsonParseObj(lEditor.getSession('currentLogo'));
			},
			slide: function (event, ui) {
				constantVars.ORIGINAL_SPACING.isJustChangeSloganLetterSpacing = true;
				$('.sloganLetterSpacing').attr("sliding", "yes");
				onSloganLetterSpacingSlide($(this), ui.value);
			}
		});
		// slider code for distance between text and slogan 
		$('.textSloganDistSlider').slider({
			value: getSliderBarValueFirstTime(objGenerate.generate, 'textSloganDistSlider'),
			min: 0,
			max: 100,
			stop: function (event, ui) {
				if ($('.textSloganDistSlider').attr('sliding') === "yes") {
					saveSliderData();
					editorUndoRedo.tsdsNewLogoObj = null;
					editorUndoRedo.tsdsNewLogoObj = lEditor.currentLogo;
					editorUndoRedo.setUndoActData(TEXT_SLOGAN_DS, editorUndoRedo.tsdsOldLogoObj, editorUndoRedo.tsdsNewLogoObj);
				}
				$('.textSloganDistSlider').attr("sliding", "no");
			},
			start: function (event, ui) {
				editorUndoRedo.tsdsOldLogoObj = null;
				editorUndoRedo.tsdsOldLogoObj = getValidJsonParseObj(lEditor.getSession('currentLogo'));
			},
			slide: function (event, ui) {
				$('.textSloganDistSlider').attr("sliding", "yes");
				onTextSloganDistanceSlide($(this), ui.value);
			}
		});
		// logo icon size slider code
		$('.logoSizeSlider').slider({
			value: getSliderBarValueFirstTime(objGenerate.generate, 'logoSizeSlider'),
			min: 25,
			max: 300,
			stop: function (event, ui) {
				if ($('.logoSizeSlider').attr('sliding') === "yes") {
					saveSliderData();
					editorUndoRedo.lssNewLogoObj = null;
					if (lEditor.currentLogo.generate.templatePath.isIcon == 1) {
						editorUndoRedo.lssNewLogoObj = Object.assign({}, lEditor.currentLogo);
						editorUndoRedo.setUndoActData(SYMBOL_SIZE, editorUndoRedo.lssOldLogoObj, editorUndoRedo.lssNewLogoObj);
					} else if (lEditor.currentLogo.generate.templatePath.isMono == 1) {
						editorUndoRedo.lssNewLogoObj = Object.assign({}, lEditor.currentLogo);
						editorUndoRedo.setUndoActData(MONOGRAM_SIZE, editorUndoRedo.lssOldLogoObj, editorUndoRedo.lssNewLogoObj);
					}
				}
				$('.logoSizeSlider').attr("sliding", "no");
			},
			start: function (event, ui) {
				editorUndoRedo.lssOldLogoObj = null;
				editorUndoRedo.lssOldLogoObj = Object.assign({}, getValidJsonParseObj(lEditor.getSession('currentLogo')));;
			},
			slide: function (event, ui) {
				$('.logoSizeSlider').attr("sliding", "yes");
				onSymbolSizeSlide($(this), ui.value);
			}
		});
		// slider code for icon distance ( up down left right )
		$('.iconDistanceSlider').slider({
			value: getSliderBarValueFirstTime(objGenerate.generate, 'iconDistanceSlider'),
			min: 0,
			max: 100,
			stop: function (event, ui) {
				if ($('.iconDistanceSlider').attr('sliding') === "yes") {
					saveSliderData();
					editorUndoRedo.idsNewLogoObj = null;
					if (lEditor.currentLogo.generate.templatePath.isIcon == 1) {
						editorUndoRedo.idsNewLogoObj = Object.assign({}, lEditor.currentLogo);
						editorUndoRedo.setUndoActData(SYMBOL_DS, editorUndoRedo.idsOldLogoObj, editorUndoRedo.idsNewLogoObj);
					} else if (lEditor.currentLogo.generate.templatePath.isMono == 1) {
						editorUndoRedo.idsNewLogoObj = Object.assign({}, lEditor.currentLogo);
						editorUndoRedo.setUndoActData(MONOGRAM_DS, editorUndoRedo.idsOldLogoObj, editorUndoRedo.idsNewLogoObj);
					}
				}
				$('.iconDistanceSlider').attr("sliding", "no");
			},
			start: function (event, ui) {
				editorUndoRedo.idsOldLogoObj = null;
				editorUndoRedo.idsOldLogoObj = Object.assign({}, getValidJsonParseObj(lEditor.getSession('currentLogo')));
			},
			slide: function (event, ui) {
				$('.iconDistanceSlider').attr("sliding", "yes");
				onSymbolDistanceSlide($(this), ui.value);
			}
		});
		// slider code for outer frame size 
		$('.frameSizeSlider').slider({
			value: getSliderBarValueFirstTime(objGenerate.generate, 'frameSizeSlider'),
			min: 1,
			max: 50,
			stop: function (event, ui) {
				if ($('.frameSizeSlider').attr('sliding') === "yes") {
					saveSliderData();
					editorUndoRedo.fssNewLogoObj = null;
					editorUndoRedo.fssNewLogoObj = lEditor.currentLogo;
					editorUndoRedo.setUndoActData(OUTER_CONTAINER_SIZE, editorUndoRedo.fssOldLogoObj, editorUndoRedo.fssNewLogoObj);
				}
				$('.frameSizeSlider').attr("sliding", "no");
			},
			start: function (event, ui) {
				editorUndoRedo.fssOldLogoObj = null;
				editorUndoRedo.fssOldLogoObj = getValidJsonParseObj(lEditor.getSession('currentLogo'));
			},
			slide: function (event, ui) {
				$('.frameSizeSlider').attr("sliding", "yes");
				onOuterFrameSizeSlide($(this), ui.value)
			}
		});
		// if (lEditor.getSession("edit_in_new_tab") != null) {
		// 	lEditor.cleanSession('edit_in_new_tab');
		// }
	}
	/**
	 * 
	 * @param {*} p_oThis 
	 * @param {*} p_nSliderValue 
	 * @param {*} p_bIsSaveData 
	 */
	function onOuterFrameSizeSlide(p_oThis, p_nSliderValue, isUpdateSlider = false) {
		if (isUpdateSlider) {
			lEditor.setSession('frameSizeSlider', p_nSliderValue);
			p_oThis.parents('.rangeSlider').find('.rangeSliderValue').val(p_nSliderValue);
			constantVars.SPACING.frameSizeSlider = p_nSliderValue;
			p_oThis.slider("option", "value", constantVars.SPACING.frameSizeSlider);
		} else {
			clearOutlineBox();
			clearOutline();
			var currLogo = lEditor.currentLogo;
			rangeSliderFlag = true;
			var size = constantVars.ORIGINAL_SPACING.frameSizeSlider - p_nSliderValue;
			var obj = updateFrameSize($('.finaLogoInner .container_1'), size * -1);
			currLogo.generate.templatePath.updates.frame.x = obj.x;
			currLogo.generate.templatePath.updates.frame.y = obj.y;
			currLogo.generate.templatePath.updates.frame.scale = obj.scale;
			lEditor.setSession('frameSizeSlider', p_nSliderValue);
			p_oThis.parents('.rangeSlider').find('.rangeSliderValue').val(p_nSliderValue);
			constantVars.SPACING.frameSizeSlider = p_nSliderValue;
			currLogo.generate.frameSizeSlider = p_nSliderValue;
			currLogo = updateCurrLogoObject(currLogo);
			lEditor.setDefaultLogo(currLogo, currLogo.generate);
			var currLogo = lEditor.currentLogo;
		}
	}
	/**
	 * 
	 * @param {*} p_sClassName 
	 * @param {*} p_nSliderValue 
	 */
	function updateLinesFSSlider(p_sClassName, p_nSliderValue) {
		switch (p_sClassName) {
			case "logoOverallLinesFSSlider":
				if ($('.dd-ct-overall-fs-slider').length) {
					$('.dd-ct-overall-fs-slider').find('.rangeSliderValue').val(p_nSliderValue);
					$('.dd-ct-overall-fs-slider').find(".logoOverallLinesFSSlider").slider("option", "value", p_nSliderValue);
				}
				break;
			case "logoLine1FSSlider":
				if ($('.dd-ct-line1-fs-slider').length) {
					$('.dd-ct-line1-fs-slider').find('.rangeSliderValue').val(p_nSliderValue);
					$('.dd-ct-line1-fs-slider').find(".logoLine1FSSlider").slider("option", "value", p_nSliderValue);
				}
				break;
			case "logoLine2FSSlider":
				if ($('.dd-ct-line2-fs-slider').length) {
					$('.dd-ct-line2-fs-slider').find('.rangeSliderValue').val(p_nSliderValue);
					$('.dd-ct-line2-fs-slider').find(".logoLine2FSSlider").slider("option", "value", p_nSliderValue);
				}
				break;
		}
	}
	/**
	 * 
	 * @param {*} p_sClassName 
	 * @param {*} p_nSliderValue 
	 */
	function updateLinesLSSlider(p_sClassName, p_nSliderValue) {
		switch (p_sClassName) {
			case "logoOverallLinesLSSlider":
				if ($('.dd-ct-overall-ls-slider').length) {
					$('.dd-ct-overall-ls-slider').find('.rangeSliderValue').val(p_nSliderValue);
					$('.dd-ct-overall-ls-slider').find(".logoOverallLinesLSSlider").slider("option", "value", p_nSliderValue);
				}
				break;
			case "logoLine1LSSlider":
				if ($('.dd-ct-line1-ls-slider').length) {
					$('.dd-ct-line1-ls-slider').find('.rangeSliderValue').val(p_nSliderValue);
					$('.dd-ct-line1-ls-slider').find(".logoLine1LSSlider").slider("option", "value", p_nSliderValue);
				}
				break;
			case "logoLine2LSSlider":
				if ($('.dd-ct-line2-ls-slider').length) {
					$('.dd-ct-line2-ls-slider').find('.rangeSliderValue').val(p_nSliderValue);
					$('.dd-ct-line2-ls-slider').find(".logoLine2LSSlider").slider("option", "value", p_nSliderValue);
				}
				break;
		}
	}
	/**
	 * 
	 * @param {*} p_nSliderValue 
	 */
	function updateText1FontSizeSlider(p_nSliderValue) {

	}
	/**
	 * 
	 * @param {*} p_nSliderValue 
	 */
	function updateText2FontSizeSlider(p_nSliderValue) {
	}
	/**
	 * 
	 * @param {*} p_nSliderValue 
	 */
	function updateText1LetterSpacingSlider(p_nSliderValue) {
		debugConsole("updateText1LetterSpacingSlider p_nSliderValue:=" + p_nSliderValue);
		$('.dd-ct-line1-ls-slider').find('.rangeSliderValue').val(p_nSliderValue);
		$('.dd-ct-line1-ls-slider').find(".logoTextSlider").slider("option", "value", p_nSliderValue);
	}
	/**
	 * 
	 * @param {*} p_nSliderValue 
	 */
	function updateText2LetterSpacingSlider(p_nSliderValue) {
		debugConsole("updateText2LetterSpacingSlider p_nSliderValue:=" + p_nSliderValue);
		$('.dd-ct-line2-ls-slider').find('.rangeSliderValue').val(p_nSliderValue);
		$('.dd-ct-line2-ls-slider').find(".logoTextSlider").slider("option", "value", p_nSliderValue);
	}
	/**
	 * 
	 * @param {*} p_oThis 
	 * @param {*} p_nSliderValue 
	 * @param {*} isUpdateSlider 
	 */
	function onTextFontSizeSlide(p_oThis, p_nSliderValue, isUpdateSlider = false) {
		if (isUpdateSlider) {
			p_oThis.parents('.rangeSlider').find('.rangeSliderValue').val(p_nSliderValue);
			lEditor.setSession('logoTextSlider', p_nSliderValue);
			constantVars.SPACING.logoTextSlider = p_nSliderValue;
			p_oThis.slider("option", "value", constantVars.SPACING.logoTextSlider);
		} else {
			clearOutlineBox();
			clearOutline();
			if (lEditor.currentLogo.generate.templatePath.isEqual == 1 && typeof lEditor.currentLogo.generate.templatePath.sloganSetAsPerText != "undefined" && lEditor.currentLogo.generate.templatePath.sloganSetAsPerText == 1) {
				lEditor.currentLogo.generate.templatePath.sloganSetAsPerText = 0;
			}
			p_oThis.parents('.rangeSlider').find('.rangeSliderValue').val(p_nSliderValue);
			var logoTextLS = lEditor.currentLogo.generate.logoLetterSpacing;
			var workFor = p_oThis.attr("work-for");
			switch (workFor) {
				case "dd-ct-line1":
					if (lEditor.currentLogo.generate.logoText1LetterSpacing) {
						logoTextLS = lEditor.currentLogo.generate.logoText1LetterSpacing;
					}
					lEditor.currentLogo.generate.logoText1Slider = p_nSliderValue;
					updateLogoText('logoName1', '', p_nSliderValue, logoTextLS, 'slider', 'logoTextSlider');

					break;
				case "dd-ct-line2":
					if (lEditor.currentLogo.generate.logoText2LetterSpacing) {
						logoTextLS = lEditor.currentLogo.generate.logoText2LetterSpacing;
					}
					lEditor.currentLogo.generate.logoText2Slider = p_nSliderValue;
					updateLogoText('logoName2', '', p_nSliderValue, logoTextLS, 'slider', 'logoTextSlider');
					break;
				default:
					lEditor.setSession('logoTextSlider', p_nSliderValue);
					constantVars.SPACING.logoTextSlider = p_nSliderValue;
					lEditor.currentLogo.generate.logoTextSlider = p_nSliderValue;
					if (lEditor.currentLogo.generate.templatePath.isDBLineCompanyText == "yes") {
						lEditor.currentLogo.generate.logoText1Slider = p_nSliderValue;
						lEditor.currentLogo.generate.logoText2Slider = p_nSliderValue;
						updateLinesFSSlider("logoLine1FSSlider", p_nSliderValue);
						updateLinesFSSlider("logoLine2FSSlider", p_nSliderValue);
					}
					updateLogoText('logoName', '', p_nSliderValue, getSliderValue('logoLetterSpacing'), 'slider', "logoTextSlider");
					break;
			}
		}
	}
	/**
	 * 
	 * @param {*} p_oThis 
	 * @param {*} p_nSliderValue 
	 * @param {*} isUpdateSlider 
	 */
	function onTextLetterSpacingSlide(p_oThis, p_nSliderValue, isUpdateSlider = false) {
		if (isUpdateSlider) {
			p_oThis.parents('.rangeSlider').find('.rangeSliderValue').val(p_nSliderValue);
			lEditor.setSession('logoLetterSpacing', p_nSliderValue);
			constantVars.SPACING.logoLetterSpacing = p_nSliderValue;
			p_oThis.slider("option", "value", constantVars.SPACING.logoLetterSpacing);
		} else {
			clearOutlineBox();
			clearOutline();
			if (lEditor.currentLogo.generate.templatePath.isEqual == 1 && typeof lEditor.currentLogo.generate.templatePath.sloganSetAsPerText != "undefined" && lEditor.currentLogo.generate.templatePath.sloganSetAsPerText == 1) {
				lEditor.currentLogo.generate.templatePath.sloganSetAsPerText = 0;
			}
			p_oThis.parents('.rangeSlider').find('.rangeSliderValue').val(p_nSliderValue);
			var logoTextFS = lEditor.currentLogo.generate.logoTextSlider;
			var workFor = p_oThis.attr("work-for");
			switch (workFor) {
				case "dd-ct-line1":
					if (lEditor.currentLogo.generate.logoText1Slider) {
						logoTextFS = lEditor.currentLogo.generate.logoText1Slider;
					}
					lEditor.currentLogo.generate.logoText1LetterSpacing = p_nSliderValue;
					updateLogoText('logoName1', '', logoTextFS, p_nSliderValue, 'slider', "logoLetterSpacing");

					break;
				case "dd-ct-line2":
					logoTextFS;
					if (lEditor.currentLogo.generate.logoText2Slider) {
						logoTextFS = lEditor.currentLogo.generate.logoText2Slider;
					}
					lEditor.currentLogo.generate.logoText2LetterSpacing = p_nSliderValue;
					updateLogoText('logoName2', '', logoTextFS, p_nSliderValue, 'slider', "logoLetterSpacing");
					break;
				default:
					lEditor.currentLogo.generate.logoLetterSpacing = p_nSliderValue;
					lEditor.setSession('logoLetterSpacing', p_nSliderValue);
					constantVars.SPACING.logoLetterSpacing = p_nSliderValue;
					if (lEditor.currentLogo.generate.templatePath.isDBLineCompanyText == "yes") {
						lEditor.currentLogo.generate.logoText1LetterSpacing = p_nSliderValue;
						lEditor.currentLogo.generate.logoText2LetterSpacing = p_nSliderValue;

						updateLinesLSSlider("logoLine1LSSlider", p_nSliderValue);
						updateLinesLSSlider("logoLine2LSSlider", p_nSliderValue);
					}
					updateLogoText('logoName', '', getSliderValue('logoTextSlider'), p_nSliderValue, 'slider', "logoLetterSpacing");
					break;
			}
		}
	}
	/**
	 * 
	 * @param {*} p_oThis 
	 * @param {*} p_nSliderValue 
	 * @param {*} isUpdateSlider 
	 */
	function onSloganFontSizeSlide(p_oThis, p_nSliderValue, isUpdateSlider = false) {
		debugConsole("onSloganFontSizeSlide:=" + p_nSliderValue + ",,,," + isUpdateSlider);
		if (isUpdateSlider) {
			p_oThis.parents('.rangeSlider').find('.rangeSliderValue').val(p_nSliderValue);
			lEditor.setSession('sloganTextSize', p_nSliderValue);
			constantVars.SPACING.sloganTextSize = p_nSliderValue;
			p_oThis.slider("option", "value", constantVars.SPACING.sloganTextSize);
		} else {
			clearOutlineBox();
			clearOutline();
			if (lEditor.currentLogo.generate.templatePath.isEqual == 1 && typeof lEditor.currentLogo.generate.templatePath.sloganSetAsPerText != "undefined" && lEditor.currentLogo.generate.templatePath.sloganSetAsPerText == 1) {
				lEditor.currentLogo.generate.templatePath.sloganSetAsPerText = 0;
			}
			lEditor.currentLogo.generate.sloganTextSize = p_nSliderValue;
			updateLogoText('slogan', '', p_nSliderValue, getSliderValue('sloganLetterSpacing'), 'slider', "sloganTextSize");
			p_oThis.parents('.rangeSlider').find('.rangeSliderValue').val(p_nSliderValue);
			lEditor.setSession('sloganTextSize', p_nSliderValue);
			constantVars.SPACING.sloganTextSize = p_nSliderValue;
		}
	}
	/**
	 * 
	 * @param {*} p_oThis 
	 * @param {*} p_nSliderValue 
	 * @param {*} isUpdateSlider 
	 */
	function onSloganLetterSpacingSlide(p_oThis, p_nSliderValue, isUpdateSlider = false) {
		if (isUpdateSlider) {
			p_oThis.parents('.rangeSlider').find('.rangeSliderValue').val(p_nSliderValue);
			lEditor.setSession('sloganLetterSpacing', p_nSliderValue);
			constantVars.SPACING.sloganLetterSpacing = p_nSliderValue;
			p_oThis.slider("option", "value", constantVars.SPACING.sloganLetterSpacing);
		} else {
			clearOutlineBox();
			clearOutline();
			if (lEditor.currentLogo.generate.templatePath.isEqual == 1 && typeof lEditor.currentLogo.generate.templatePath.sloganSetAsPerText != "undefined" && lEditor.currentLogo.generate.templatePath.sloganSetAsPerText == 1) {
				lEditor.currentLogo.generate.templatePath.sloganSetAsPerText = 0;
			}
			lEditor.currentLogo.generate.sloganLetterSpacing = p_nSliderValue;
			updateLogoText('slogan', '', getSliderValue('sloganTextSize'), p_nSliderValue, 'slider', "sloganLetterSpacing");
			p_oThis.parents('.rangeSlider').find('.rangeSliderValue').val(p_nSliderValue);
			lEditor.setSession('sloganLetterSpacing', p_nSliderValue);
			constantVars.SPACING.sloganLetterSpacing = p_nSliderValue;
		}
	}
	/**
	 * 
	 * @param {*} p_oThis 
	 * @param {*} p_nSliderValue 
	 * @param {*} p_bIsSaveData 
	 */
	function onTextSloganDistanceSlide(p_oThis, p_nSliderValue, isUpdateSlider = false) {
		debugConsole("onTextSloganDistanceSlide p_nSliderValue:=" + p_nSliderValue + ",,,isUpdateSlider:=" + isUpdateSlider);
		if (isUpdateSlider) {
			p_oThis.parents('.rangeSlider').find('.rangeSliderValue').val(p_nSliderValue);
			lEditor.setSession('textSloganDistSlider', p_nSliderValue);
			constantVars.SPACING.textSloganDistSlider = p_nSliderValue;
			p_oThis.slider("option", "value", constantVars.SPACING.textSloganDistSlider);
		} else {
			clearOutlineBox();
			clearOutline();
			var currVal = getSliderValue('textSloganDistSlider');
			p_oThis.parents('.rangeSlider').find('.rangeSliderValue').val(p_nSliderValue);
			lEditor.setSession('textSloganDistSlider', p_nSliderValue);
			constantVars.SPACING.textSloganDistSlider = p_nSliderValue;
			lEditor.currentLogo.generate.textSloganDistSlider = p_nSliderValue;
			var updatedVal = p_nSliderValue - currVal;
			var currLogo = lEditor.currentLogo;
			rangeSliderFlag = true;

			var bbox = $('.svgSlideContent  .svgLogoName_1').get(0).getBBox();
			debugConsole("bbox.height:=" + bbox.height + ",,,," + currLogo.generate.templatePath.updates.slogan.y);
			currLogo.generate.templatePath.updates.slogan.y = parseFloat(currLogo.generate.templatePath.slogan.y) + parseFloat(updatedVal);

			updatedVal = updatedVal * currLogo.generate.templatePath.updates.slogan.scale;

			if (currLogo.generate.templatePath.isDBLineCompanyText == "yes") {
				currLogo.generate.templatePath.lastTextDistance = p_nSliderValue;///2;
			} else {
				currLogo.generate.templatePath.lastTextDistance = p_nSliderValue;
			}

			if (currLogo.generate.templatePath.isIconFrame == 1) {
				currLogo.generate.templatePath.iconShiftDueToSloganDistance = p_nSliderValue * currLogo.generate.templatePath.updates.slogan.scale;
			} else {
				currLogo.generate.templatePath.iconShiftDueToSloganDistance = undefined;
			}


			let isIconOrMonoShifting = false;
			if (currLogo.generate.templatePath.isIcon == 1 || currLogo.generate.templatePath.isMono == 1) {
				if ((currLogo.generate.templatePath.icon.yType === "up" || currLogo.generate.templatePath.slogan.yType === "up") && currLogo.generate.templatePath.textAndSlogan.yType === "down") {
					currLogo.generate.templatePath.updates.iconFrameBox.y = parseFloat(currLogo.generate.templatePath.iconFrameBox.y) + parseFloat(updatedVal / currLogo.generate.templatePath.updates.iconFrameBox.scale)
					isIconOrMonoShifting = true;
				}
			}
			debugConsole("isIconOrMonoShifting:=" + isIconOrMonoShifting);
			currLogo = updateCurrLogoObject(currLogo);
			lEditor.setDefaultLogo(currLogo, currLogo.generate);
			var currLogo = lEditor.currentLogo;
			$('.svgSloganText_1').attr('transform', "scale(" + currLogo.generate.templatePath.slogan.scale + ") translate(" + parseFloat(currLogo.generate.templatePath.slogan.x) + "," + parseFloat(currLogo.generate.templatePath.slogan.y) + ")");
			if (isIconOrMonoShifting) {
				$('.sampleIconBox').attr('transform', "scale(" + currLogo.generate.templatePath.iconFrameBox.scale + ") translate(" + currLogo.generate.templatePath.iconFrameBox.x + "," + currLogo.generate.templatePath.iconFrameBox.y + ")");
			}
		}
	}
	/**
	 * 
	 * @param {*} p_oThis 
	 * @param {*} p_nSliderValue 
	 * @param {*} isUpdateSlider 
	 */
	function onSymbolSizeSlide(p_oThis, p_nSliderValue, isUpdateSlider = false) {
		if (isUpdateSlider) {
			p_oThis.parents('.rangeSlider').find('.rangeSliderValue').val(p_nSliderValue);
			lEditor.setSession('logoSizeSlider', p_nSliderValue);
			constantVars.SPACING.logoSizeSlider = p_nSliderValue;
			p_oThis.slider("option", "value", constantVars.SPACING.logoSizeSlider);
		} else {
			clearOutlineBox();
			clearOutline();
			p_oThis.parents('.rangeSlider').find('.rangeSliderValue').val(p_nSliderValue);
			var currLogo = Object.assign({}, lEditor.currentLogo);
			// if (currLogo.generate.templatePath.isMono == 1) {
			// 	constantVars.SPACING.monogramTextSize = p_nSliderValue;
			// 	constantVars.ORIGINAL_SPACING.monogramTextSize = p_nSliderValue;
			// } else {
			var updatedVal = p_nSliderValue;

			currLogo = Object.assign({}, updateCurrLogoObject(currLogo));
			if (currLogo.generate.templatePath.isIconFrame == 1) {
				// var obj = updateGroupSize($('.finaLogoInner  .sampleIconBox'), currLogo.generate.templatePath, 'iconFrameBox', p_nSliderValue / constantVars.ORIGINAL_SPACING.logoSizeSlider);
				// currLogo.generate.templatePath.updates.iconFrameBox.x = obj.x;
				// currLogo.generate.templatePath.updates.iconFrameBox.y = obj.y;
				// currLogo.generate.templatePath.updates.iconFrameBox.scale = obj.scale;

				var obj = updateCurrentIconSize($('.finaLogoInner .sampleIconBox'), currLogo.generate.templatePath, p_nSliderValue, 'iconFrameBox');
				currLogo.generate.templatePath.updates.iconFrameBox.x = obj.x;
				currLogo.generate.templatePath.updates.iconFrameBox.y = obj.y;
				currLogo.generate.templatePath.updates.iconFrameBox.scale = obj.scale;

			} else {
				var obj = updateCurrentIconSize($('.finaLogoInner .sampleIcons_1'), currLogo.generate.templatePath, updatedVal, 'icon');
				currLogo.generate.templatePath.updates.icon.x = obj.x;
				currLogo.generate.templatePath.updates.icon.y = obj.y;
				currLogo.generate.templatePath.updates.icon.scale = obj.scale;
			}

			lEditor.setSession('logoSizeSlider', p_nSliderValue);
			constantVars.SPACING.logoSizeSlider = p_nSliderValue;
			currLogo.generate.logoSizeSlider = p_nSliderValue;
			var currLogo1 = Object.assign({}, updateCurrLogoObject(currLogo));
			lEditor.setDefaultLogo(currLogo1, currLogo1.generate);
			// }
		}
	}
	/**
	 * 
	 * @param {*} p_oThis 
	 * @param {*} p_nSliderValue 
	 * @param {*} isUpdateSlider 
	 */
	function onSymbolDistanceSlide(p_oThis, p_nSliderValue, isUpdateSlider = false) {
		if (isUpdateSlider) {
			debugConsole("onSymbolDistanceSlide p_nSliderValue:=" + p_nSliderValue);
			lEditor.setSession('iconDistanceSlider', p_nSliderValue);
			p_oThis.parents('.rangeSlider').find('.rangeSliderValue').val(p_nSliderValue);
			p_oThis.slider("option", "value", p_nSliderValue);
			constantVars.SPACING.iconDistanceSlider = p_nSliderValue;
		} else {
			clearOutlineBox();
			clearOutline();
			var currVal = getSliderValue('iconDistanceSlider');
			lEditor.setSession('iconDistanceSlider', p_nSliderValue);
			p_oThis.parents('.rangeSlider').find('.rangeSliderValue').val(p_nSliderValue);
			constantVars.SPACING.iconDistanceSlider = p_nSliderValue;
			lEditor.currentLogo.generate.iconDistanceSlider = p_nSliderValue;
			var updatedVal = p_nSliderValue - currVal;
			debugConsole("p_nSliderValue:=" + p_nSliderValue);
			debugConsole("currVal:=" + currVal);
			debugConsole("updatedVall:=" + updatedVal);

			var currLogo = Object.assign({}, lEditor.currentLogo);

			switch (currLogo.generate.templatePath.tempType) {
				case "center":
					if ((currLogo.generate.templatePath.iconFrameBox.yType === "up") || (currLogo.generate.templatePath.iconFrameBox.yType === "down")) {
						currLogo.generate.templatePath.lastSymbolYDistance = p_nSliderValue;
					}

					var textCond1 = false;
					var textCond2 = false;
					var textCond3 = false;
					if (currLogo.generate.templatePath.isDBLineCompanyText == "yes") {
						if ((currLogo.generate.templatePath.icon.yType === "center") && (currLogo.generate.templatePath.text1.yType === "down") && (currLogo.generate.templatePath.slogan.yType === "up")) {
							textCond1 = true;
						} else if ((currLogo.generate.templatePath.icon.yType === "down" || currLogo.generate.templatePath.icon.yType === "center") && (currLogo.generate.templatePath.text1.yType === "up")) {
							textCond2 = true;
						}
						else if ((currLogo.generate.templatePath.icon.yType === "up" || currLogo.generate.templatePath.icon.yType === "center") && (currLogo.generate.templatePath.text1.yType === "down")) {
							textCond3 = true;
						}
					} else {
						if ((currLogo.generate.templatePath.icon.yType === "center") && (currLogo.generate.templatePath.text.yType === "down") && (currLogo.generate.templatePath.slogan.yType === "up")) {
							textCond1 = true;
						}
						else if ((currLogo.generate.templatePath.icon.yType === "down" || currLogo.generate.templatePath.icon.yType === "center") && (currLogo.generate.templatePath.text.yType === "up")) {
							textCond2 = true;
						}
						else if ((currLogo.generate.templatePath.icon.yType === "up" || currLogo.generate.templatePath.icon.yType === "center") && (currLogo.generate.templatePath.text.yType === "down")) {
							textCond3 = true;
						}
					}
					if (textCond1) {
						if (currLogo.generate.templatePath.template_direction == 0) {
							currLogo.generate.templatePath.updates.textAndSlogan.y = parseFloat(currLogo.generate.templatePath.textAndSlogan.y) + parseFloat(updatedVal);
							currLogo.generate.templatePath.updates.iconFrameBox.y = parseFloat(currLogo.generate.templatePath.iconFrameBox.y) - parseFloat(updatedVal);
							debugConsole("cond1");
						} else {
							currLogo.generate.templatePath.updates.textAndSlogan.y = parseFloat(currLogo.generate.templatePath.textAndSlogan.y) - parseFloat(updatedVal);
							currLogo.generate.templatePath.updates.iconFrameBox.y = parseFloat(currLogo.generate.templatePath.iconFrameBox.y) + parseFloat(updatedVal);
							debugConsole("cond2");
						}
					}
					else if (textCond2) {
						currLogo.generate.templatePath.updates.textAndSlogan.y = parseFloat(currLogo.generate.templatePath.textAndSlogan.y) + parseFloat(updatedVal);
						currLogo.generate.templatePath.updates.iconFrameBox.y = parseFloat(currLogo.generate.templatePath.iconFrameBox.y) - parseFloat(updatedVal);
						debugConsole("cond3");
					}
					else if (textCond3) {
						currLogo.generate.templatePath.updates.textAndSlogan.y = parseFloat(currLogo.generate.templatePath.textAndSlogan.y) - parseFloat(updatedVal);
						currLogo.generate.templatePath.updates.iconFrameBox.y = parseFloat(currLogo.generate.templatePath.iconFrameBox.y) + parseFloat(updatedVal);
						debugConsole("cond4");
					} else {
						currLogo.generate.templatePath.updates.textAndSlogan.y = parseFloat(currLogo.generate.templatePath.textAndSlogan.y) + parseFloat(updatedVal);
						currLogo.generate.templatePath.updates.iconFrameBox.y = parseFloat(currLogo.generate.templatePath.iconFrameBox.y) - parseFloat(updatedVal);
						debugConsole("cond5");
					}
					debugConsole("currLogo.generate.templatePath.updates.textAndSlogan.y:=" + currLogo.generate.templatePath.updates.textAndSlogan.y);
					break;

				case "left":
					currLogo.generate.templatePath.updates.textAndSlogan.x = parseFloat(currLogo.generate.templatePath.textAndSlogan.x) + parseFloat(updatedVal);
					currLogo.generate.templatePath.updates.iconFrameBox.x = parseFloat(currLogo.generate.templatePath.iconFrameBox.x) - parseFloat(updatedVal);
					currLogo.generate.templatePath.lastSymbolXDistance = p_nSliderValue;
					break;

				case "right":
					currLogo.generate.templatePath.updates.textAndSlogan.x = parseFloat(currLogo.generate.templatePath.textAndSlogan.x) - parseFloat(updatedVal);
					debugConsole("iconFrameBox.x1:=" + currLogo.generate.templatePath.iconFrameBox.x);
					currLogo.generate.templatePath.updates.iconFrameBox.x = parseFloat(currLogo.generate.templatePath.iconFrameBox.x) + parseFloat(updatedVal);
					debugConsole("iconFrameBox.x2:=" + currLogo.generate.templatePath.iconFrameBox.x);
					currLogo.generate.templatePath.lastSymbolXDistance = p_nSliderValue;
					break;

			}
			currLogo.generate.iconDistanceSlider = p_nSliderValue;
			var currLogo1 = Object.assign({}, updateCurrLogoObject(currLogo));
			lEditor.setDefaultLogo(currLogo1, currLogo1.generate);
			var currLogo2 = Object.assign({}, lEditor.currentLogo);
			$('.sampleTexts_1').attr('transform', "scale(" + currLogo2.generate.templatePath.textAndSlogan.scale + ") translate(" + currLogo2.generate.templatePath.textAndSlogan.x + "," + currLogo2.generate.templatePath.textAndSlogan.y + ")");
			$('.sampleIconBox').attr('transform', "scale(" + currLogo2.generate.templatePath.iconFrameBox.scale + ") translate(" + currLogo2.generate.templatePath.iconFrameBox.x + "," + currLogo2.generate.templatePath.iconFrameBox.y + ")");
			// lEditor.previewColors();
			// lEditor.previewLogo();
		}
	}
    /**
	 * 
	 * @param {*} dataGenerateObj 
	 * @param {*} key 
	 */
	function getSliderBarValueFirstTime(dataGenerateObj, key) {
		var value;
		switch (key) {
			case "logoTextSlider":
				if (typeof dataGenerateObj.logoTextSlider !== 'undefined') {
					value = dataGenerateObj.logoTextSlider;
					lEditor.setSession('logoTextSlider', value);
					debugConsole("set from json");
				}
				else if (!(lEditor.getSession(key) == null || lEditor.getSession(key) == 'undefined')) {
					value = lEditor.getSession(key);
					debugConsole("set from session");
				}
				else {
					value = constantVars.SPACING[key];
					debugConsole("set default");
				}
				constantVars.SPACING.logoTextSlider = value;
				break;

			case "logoLetterSpacing":
				if (typeof dataGenerateObj.logoLetterSpacing !== 'undefined') {
					value = dataGenerateObj.logoLetterSpacing;
					lEditor.setSession('logoLetterSpacing', value);
					debugConsole("set from json");
				}
				else if (!(lEditor.getSession(key) == null || lEditor.getSession(key) == 'undefined')) {
					value = lEditor.getSession(key);
					debugConsole("set from session");
				}
				else {
					value = constantVars.SPACING[key];
					debugConsole("set default");
				}
				constantVars.SPACING.logoLetterSpacing = value;
				break;

			case "sloganTextSize":
				if (typeof dataGenerateObj.sloganTextSize !== 'undefined') {
					value = dataGenerateObj.sloganTextSize;
					lEditor.setSession('sloganTextSize', value);
					debugConsole("set from json");
				}
				else if (!(lEditor.getSession(key) == null || lEditor.getSession(key) == 'undefined')) {
					value = lEditor.getSession(key);
					debugConsole("set from session");
				}
				else {
					value = constantVars.SPACING[key];
					debugConsole("set default");
				}
				constantVars.SPACING.sloganTextSize = value;
				break;
			case "sloganLetterSpacing":
				if (typeof dataGenerateObj.sloganLetterSpacing !== 'undefined') {
					value = dataGenerateObj.sloganLetterSpacing;
					lEditor.setSession('sloganLetterSpacing', value);
					debugConsole("set from json");
				}
				else if (!(lEditor.getSession(key) == null || lEditor.getSession(key) == 'undefined')) {
					value = lEditor.getSession(key);
					debugConsole("set from session");
				}
				else {
					value = constantVars.SPACING[key];
					debugConsole("set default");
				}
				constantVars.SPACING.sloganLetterSpacing = value;
				break;

			case "textSloganDistSlider":
				if (typeof dataGenerateObj.textSloganDistSlider !== 'undefined') {
					value = dataGenerateObj.textSloganDistSlider;
					lEditor.setSession('textSloganDistSlider', value);
					debugConsole("set from json");
				}
				else if (!(lEditor.getSession(key) == null || lEditor.getSession(key) == 'undefined')) {
					value = lEditor.getSession(key);
					debugConsole("set from session");
				}
				else {
					value = constantVars.SPACING[key];
					debugConsole("set default");
				}
				constantVars.SPACING.textSloganDistSlider = value;
				break;

			case "logoSizeSlider":
				if (typeof dataGenerateObj.logoSizeSlider !== 'undefined') {
					value = dataGenerateObj.logoSizeSlider;
					lEditor.setSession('logoSizeSlider', value);
					debugConsole("set from json");
				}
				else if (!(lEditor.getSession(key) == null || lEditor.getSession(key) == 'undefined')) {
					value = lEditor.getSession(key);
					debugConsole("set from session");
				}
				else {
					value = constantVars.SPACING[key];
					debugConsole("set default");
				}
				constantVars.SPACING.logoSizeSlider = value;
				break;

			case "iconDistanceSlider":
				if (typeof dataGenerateObj.iconDistanceSlider !== 'undefined') {
					value = dataGenerateObj.iconDistanceSlider;
					lEditor.setSession('iconDistanceSlider', value);
					debugConsole("set from json");
				}
				else if (!(lEditor.getSession(key) == null || lEditor.getSession(key) == 'undefined')) {
					value = lEditor.getSession(key);
					debugConsole("set from session");
				}
				else {
					value = constantVars.SPACING[key];
					debugConsole("set default");
				}
				constantVars.SPACING.iconDistanceSlider = value;
				break;

			case "frameSizeSlider":
				debugConsole("dataGenerateObj.frameSizeSlider:=" + dataGenerateObj.frameSizeSlider);
				if (typeof dataGenerateObj.frameSizeSlider !== 'undefined') {
					value = dataGenerateObj.frameSizeSlider;
					lEditor.setSession('frameSizeSlider', value);
					debugConsole("set from json");
				}
				else if (!(lEditor.getSession(key) == null || lEditor.getSession(key) == 'undefined')) {
					value = lEditor.getSession(key);
					debugConsole("set from session");
				}
				else {
					value = constantVars.SPACING[key];
					debugConsole("set default");
				}
				constantVars.SPACING.frameSizeSlider = value;
				break;
		}
		debugConsole("getSliderBarValueFirstTime key:=" + key + ",,,,value:=" + value);
		$('.' + key).parents('.rangeSlider').find('.rangeSliderValue').val(value);
		return value;
	}
    /**
	 * 
	 * @param {*} key 
	 */
	function getSliderValue(key) {
		var value = constantVars.SPACING[key];
		if (!(lEditor.getSession(key) == null || lEditor.getSession(key) == 'undefined')) {
			value = lEditor.getSession(key);
		}
		// debugConsole("getSliderValue key:=" + key + ",,,,value:=" + value);
		return value;
	}
	/*==== Common Setting JS ====*/
	/**
	 * calculation of update current icon size 
	 * @param {*} object 
	 * @param {*} dimension 
	 * @param {*} size 
	 * @param {*} type 
	 */
	function updateCurrentIconSize(object, dimension, size, type, isSetLastSymbolXDistance = true) {
		debugConsole("updateCurrentIconSize: object:=" + object + ",,,,dimension:=" + dimension + ",,,,,size:=" + size + ",,,,,type:=" + type + ",,,isSetLastSymbolXDistance:=" + isSetLastSymbolXDistance);
		var bbox = object.get(0).getBBox();
		var x = dimension[type].x;
		var y = dimension[type].y
		var obj = {};
		size = Number(size);
		dimension[type].scale = Number(dimension[type].scale);


		var scale = Number( /* dimension[type].scale + */ size / (bbox.width > bbox.height ? bbox.width : bbox.height));  // * dimension[type].scale * dimension['containerBody'].scale * dimension['logoContainer'].scale ;

		debugConsole("bbox.width:=" + bbox.width);
		debugConsole("bbox.height:=" + bbox.height);
		if (isSetLastSymbolXDistance) {
			debugConsole("dimension.lastSymbolXDistance:=" + dimension.lastSymbolXDistance);
		}


		if (dimension[type].xType == 'left') {
			if (type == "iconFrameBox") {
				// x = Number((constantVars.SVGWIDTH * dimension[type].widthStart / 100) / scale - bbox.width - bbox.x);
				debugConsole("dimension[type].widthStart:=" + dimension[type].widthStart);
				if (dimension.isMono == 1) {

					x = Number((constantVars.SVGWIDTH * (dimension[type].widthStart) / 100) / scale - bbox.x);
				} else {
					// x = Number((constantVars.SVGWIDTH * (dimension[type].widthStart) / 100) / scale - (bbox.width / 2) - bbox.x);
					x = Number((constantVars.SVGWIDTH * (dimension[type].widthStart) / 100) / scale - bbox.x);
				}

				if (type == "iconFrameBox" && dimension.lastSymbolXDistance != undefined && isSetLastSymbolXDistance) {
					x = x + dimension.lastSymbolXDistance;
				}
			} else {
				// x = Number((constantVars.SVGWIDTH * dimension[type].widthStart / 100) / scale - bbox.x * scale);
				debugConsole("dimension[type].widthStart:=" + dimension[type].widthStart);
				if (dimension.isMono == 1) {

					x = Number((constantVars.SVGWIDTH * (dimension[type].widthStart) / 100) / scale - bbox.x);
				} else {
					// x = Number((constantVars.SVGWIDTH * (dimension[type].widthStart) / 100) / scale - (bbox.width / 2) - bbox.x);
					x = Number((constantVars.SVGWIDTH * (dimension[type].widthStart) / 100) / scale - bbox.x);
				}
			}
		}
		if (dimension[type].xType == 'center') {
			x = Number(((constantVars.SVGWIDTH * dimension[type].widthPercent / 100) + (constantVars.SVGWIDTH * dimension[type].widthStart / 100)) / (2 * scale) - ((bbox.width) / 2) - bbox.x);
		}
		if (dimension[type].xType == 'right') {
			x = Number((constantVars.SVGWIDTH * dimension[type].widthStart / 100) + (constantVars.SVGWIDTH * dimension[type].widthPercent / 100) / scale - bbox.width - bbox.x);
			if (type == "iconFrameBox" && dimension.lastSymbolXDistance != undefined && isSetLastSymbolXDistance) {
				x = x - dimension.lastSymbolXDistance;
			}
		}


		if (dimension[type].yType == 'up') {
			var ab = 0;
			if ((dimension.iconShiftDueToSloganDistance) != undefined) {
				if (parseInt(dimension.iconShiftDueToSloganDistance) > 0) {
					ab = dimension.iconShiftDueToSloganDistance;

				}
			}
			debugConsole("ab:=" + ab);
			y = Number(((constantVars.SVGHEIGHT * dimension[type].heightStart / 100) + ab) / scale - bbox.y);
			if (type == "iconFrameBox" && dimension.lastSymbolYDistance != undefined) {
				y = y + dimension.lastSymbolYDistance;
			}

		}
		if (dimension[type].yType == 'center') {
			y = Number((constantVars.SVGHEIGHT * dimension[type].heightStart / 100 + constantVars.SVGHEIGHT * dimension[type].heightPercent / 100) / (2 * scale) - bbox.height / 2 - bbox.y);
			// y = y -200;

		}

		debugConsole("dimension[type].yType:=" + dimension[type].yType);
		debugConsole("type:=" + type);
		if (dimension[type].yType == 'down') {
			y = Number(((constantVars.SVGHEIGHT * dimension[type].heightStart / 100) + (constantVars.SVGHEIGHT * dimension[type].heightPercent / 100)) / scale - (bbox.height) - bbox.y);
			if (type == "iconFrameBox" && dimension.lastSymbolYDistance != undefined) {
				debugConsole("aaaayayaya");
				y = y - dimension.lastSymbolYDistance;
			}
		}



		object.attr('transform', "scale(" + scale + ") translate(" + x + "," + y + ")");
		obj = { 'x': x, 'y': y, 'scale': scale };
		return obj;
	}
	/*==== Font case Js ====*/
    /**
	 * for chanign compnay name font and slogan name font
	 */
	$('.companyFontCase').click(function (e) {
		e.stopImmediatePropagation();
		var textCase = $(this).text();
		textCase = textCase.toLowerCase();
		debugConsole("companyFontCase click textCase:=" + textCase);


		debugConsole("e=" + e + ",,,," + e.target + ",,,," + e.currentTarget);
		var originalUpdateText = "";
		var updateText = "";

		switch (constantVars.targets[lEditor.getSession('targetlink')]) {
			case "slogan":
				originalUpdateText = $('.editSloganName').val();
				updateText = originalUpdateText;
				switch (textCase) {
					case 'normal': {
						updateText = updateText;
						break;
					}
					case 'caps': {
						updateText = toCapitalize(updateText.toLowerCase());
						break;
					}
					case 'up': {
						updateText = updateText.toUpperCase();
						break;
					}
					case 'low': {
						updateText = updateText.toLowerCase();
						break;
					}

				}
				debugConsole("originalUpdateText:=" + originalUpdateText);
				debugConsole("updateText:=" + updateText);
				if (originalUpdateText === updateText) {
					debugConsole("no need to convert slogan");
					return;
				}
				if (lEditor.currentLogo.generate.templatePath.isEqual == 1 && typeof lEditor.currentLogo.generate.templatePath.sloganSetAsPerText != "undefined" && lEditor.currentLogo.generate.templatePath.sloganSetAsPerText == 1) {
					lEditor.currentLogo.generate.templatePath.sloganSetAsPerText = 0;
				}
				updateLogoText(constantVars.targets[lEditor.getSession('targetlink')], textCase, getSliderValue('sloganTextSize'), getSliderValue('sloganLetterSpacing'), '');
				break;
			case "logo":
				originalUpdateText = $('.editCompanyName').val();
				updateText = originalUpdateText;
				switch (textCase) {
					case 'normal': {
						updateText = updateText;
						break;
					}
					case 'caps': {
						updateText = toCapitalize(updateText.toLowerCase());
						break;
					}
					case 'up': {
						updateText = updateText.toUpperCase();
						break;
					}
					case 'low': {
						updateText = updateText.toLowerCase();
						break;
					}

				}
				debugConsole("originalUpdateText:=" + originalUpdateText);
				debugConsole("updateText:=" + updateText);
				if (originalUpdateText === updateText) {
					debugConsole("no need to convert logo");
					return;
				}
				if (lEditor.currentLogo.generate.templatePath.isEqual == 1 && typeof lEditor.currentLogo.generate.templatePath.sloganSetAsPerText != "undefined" && lEditor.currentLogo.generate.templatePath.sloganSetAsPerText == 1) {
					lEditor.currentLogo.generate.templatePath.sloganSetAsPerText = 0;
				}
				updateLogoText("logoName", textCase, getSliderValue('logoTextSlider'), getSliderValue('logoLetterSpacing'), 'layout');
				break;
		}
	});
	/*=== Change Text on Keyup===*/
	$('.templateText.editCompanyName').keydown(function () {
		debugConsole(".templateText.editCompanyName keydown");
		clearTimeout(inputTextTimer);
		inputTextTimer = setTimeout(function () {
			if (removeMultipleSpaces($('.templateText.editCompanyName').val()) === removeMultipleSpaces(lEditor.getSession('logoname'))) {
				debugConsole("no need logo name");
				return;
			}
			onLogoNameTextInput("");
		}, inputTextTime)
	});
	//-------------- changing slogan---------------------  
	$('.templateText.editSloganName').keydown(function () {
		debugConsole(".templateText.editSloganName keydown");
		clearTimeout(inputTextTimer);
		inputTextTimer = setTimeout(function () {
			if (removeMultipleSpaces($('.templateText.editSloganName').val()) === removeMultipleSpaces(lEditor.getSession('sloganText'))) {
				debugConsole("no need sloganText name");
				return;
			}
			onLogoNameTextInput("");
		}, inputTextTime)
	});
	//--------------
	$('.templateText').blur(function (e) {
		debugConsole(".templateText blur");
		clearTimeout(inputTextTimer);
	});
	$('.templateText').on('input', function (e) {
		debugConsole("templateText input" + $(this).hasClass("editSloganName"));
		var type = "";
		if ($(this).hasClass("editSloganName")) {
			type = "slogan";
			if (removeMultipleSpaces($(this).val()) === removeMultipleSpaces(lEditor.getSession('sloganText'))) {
				debugConsole("no need slogan");
				return;
			}
		} else {
			type = "logo";
			if (removeMultipleSpaces($(this).val()) === removeMultipleSpaces(lEditor.getSession('logoname'))) {
				debugConsole("no need logo name");
				return;
			}
		}
		updateTextOnInput(type);
	});
	/**
	 * 
	 * @param {*} p_sType 
	 */
	function updateTextOnInput(p_sType) {
		debugConsole("updateTextOnInput p_sType:=" + p_sType);
		var fs = 0;
		var ls = 0;
		var svgPath = null;
		var el = null;
		var updatedText;
		var obj;
		var updatedSvgValue = null;
		switch (p_sType) {
			case "logo":
			case "logoName":
				updatedText = removeMultipleSpaces($(".editCompanyName.templateText").val());
				if (updatedText.length == 0) {
					$('.templateText.editCompanyName').val(lEditor.getSession('logoname').charAt(0));
					return;
				}
				fs = parseFloat(lEditor.currentLogo.generate.logoTextSlider);
				ls = parseFloat(lEditor.currentLogo.generate.logoLetterSpacing);

				svgPath = currCompFontObject.getPath(updatedText, 0, 0, fs, { 'letterSpacing': ls });
				el = $('.finaLogoInner .svgLogoName_1');
				el.html(svgPath.toSVG());
				obj = updateGroupSize(el, lEditor.currentLogo.generate.templatePath, 'text', 0);
				updatedSvgValue = "scale(" + obj.scale + ") translate(" + obj.x + "," + obj.y + ")";
				el.attr("transform", updatedSvgValue);
				break;
			case "logoName1":
				updatedText = removeMultipleSpaces($(".dd-ct-line1.templateText").val());
				if (updatedText.length == 0) {
					$(".dd-ct-line1.templateText").val(lEditor.currentLogo.logoName1.charAt(0));
					return;
				}
				debugConsole("updatedText:=" + updatedText);
				fs = parseFloat(lEditor.currentLogo.generate.logoTextSlider);
				ls = parseFloat(lEditor.currentLogo.generate.logoLetterSpacing);
				if (lEditor.currentLogo.generate.logoText1Slider) {
					fs = parseFloat(lEditor.currentLogo.generate.logoText1Slider);
				}
				if (lEditor.currentLogo.generate.logoText1LetterSpacing) {
					ls = parseFloat(lEditor.currentLogo.generate.logoText1LetterSpacing);
				}
				svgPath = currCompFontObject.getPath(updatedText, 0, 0, fs, { 'letterSpacing': ls });
				el = $('.finaLogoInner .svgLogoName_1');
				el.html(svgPath.toSVG());
				obj = updateGroupSize(el, lEditor.currentLogo.generate.templatePath, 'text1', 0);
				updatedSvgValue = "scale(" + obj.scale + ") translate(" + obj.x + "," + obj.y + ")";
				el.attr("transform", updatedSvgValue);
				var changeLogoName = updatedText + " " + lEditor.currentLogo.logoName2;
				$('.company-text-dd').text(changeLogoName);
				break;
			case "logoName2":
				updatedText = removeMultipleSpaces($(".dd-ct-line2.templateText").val());
				if (updatedText.length == 0) {
					$(".dd-ct-line2.templateText").val(lEditor.currentLogo.logoName2.charAt(0));
					return;
				}
				debugConsole("updatedText:=" + updatedText);
				fs = parseFloat(lEditor.currentLogo.generate.logoTextSlider);
				ls = parseFloat(lEditor.currentLogo.generate.logoLetterSpacing);
				if (lEditor.currentLogo.generate.logoText2Slider) {
					fs = parseFloat(lEditor.currentLogo.generate.logoText2Slider);
				}
				if (lEditor.currentLogo.generate.logoText2LetterSpacing) {
					ls = parseFloat(lEditor.currentLogo.generate.logoText2LetterSpacing);
				}
				svgPath = currCompFontObject.getPath(updatedText, 0, 0, fs, { 'letterSpacing': ls });
				el = $('.finaLogoInner .svgLogoName_2');
				el.html(svgPath.toSVG());
				obj = updateGroupSize(el, lEditor.currentLogo.generate.templatePath, 'text2', 0);
				updatedSvgValue = "scale(" + obj.scale + ") translate(" + obj.x + "," + obj.y + ")";
				el.attr("transform", updatedSvgValue);
				var changeLogoName = lEditor.currentLogo.logoName1 + " " + updatedText;
				$('.company-text-dd').text(changeLogoName);
				break;
			case "slogan":
				fs = parseFloat(lEditor.currentLogo.generate.sloganTextSize);
				ls = parseFloat(lEditor.currentLogo.generate.sloganLetterSpacing);
				updatedText = removeMultipleSpaces($(".editSloganName.templateText").val());
				svgPath = currSloganFontObject.getPath(updatedText, 0, 0, fs, { 'letterSpacing': ls });
				el = $('.finaLogoInner .svgSloganText_1');
				el.html(svgPath.toSVG());
				obj = updateGroupSize(el, lEditor.currentLogo.generate.templatePath, 'slogan', 0);
				updatedSvgValue = "scale(" + obj.scale + ") translate(" + obj.x + "," + obj.y + ")";
				el.attr("transform", updatedSvgValue);

				el = $('.finaLogoInner .sampleTexts_1');
				obj = updateGroupSize(el, lEditor.currentLogo.generate.templatePath, 'textAndSlogan', 0);
				updatedSvgValue = "scale(" + obj.scale + ") translate(" + obj.x + "," + obj.y + ")";
				el.attr("transform", updatedSvgValue);
				break;
		}
	}
	/**
	 * 
	 */
	function onLogoNameTextInput(p_sType = "", p_sLogoText) {
		debugConsole("onLogoNameTextInput");
		lEditor.currentLogo = getValidJsonParseObj(lEditor.getSession('currentLogo'));
		let checkType = p_sType;
		if (checkType == "") {
			checkType = constantVars.targets[lEditor.getSession('targetlink')];
		}
		debugConsole("checkType:=" + checkType);
		var logoTextFS = lEditor.currentLogo.generate.logoTextSlider;
		var logoTextLS = lEditor.currentLogo.generate.logoLetterSpacing;
		switch (checkType) {
			case "slogan":
				if (lEditor.currentLogo.generate.templatePath.isEqual == 1 && lEditor.currentLogo.generate.templatePath.sloganSetAsPerText == 1) {
					lEditor.currentLogo.generate.templatePath.sloganSetAsPerText = 0;
				}
				updateLogoText(checkType, '', getSliderValue('sloganTextSize'), getSliderValue('sloganLetterSpacing'), 'sloganTextEdit');
				break;
			case "undo_redo_slogan":
				updateLogoText(checkType, '', lEditor.currentLogo.generate.sloganTextSize, lEditor.currentLogo.generate.sloganLetterSpacing, "");
				break;
			case "logo":
				if (removeMultipleSpaces($('.editCompanyName').val()) == '') {
					$('.editCompanyName').val(lEditor.getSession('logoname'));
					return false;
				}
				if (lEditor.currentLogo.generate.templatePath.isEqual == 1 && lEditor.currentLogo.generate.templatePath.sloganSetAsPerText == 1) {
					lEditor.currentLogo.generate.templatePath.sloganSetAsPerText = 0;
				}
				updateLogoText(checkType, '', getSliderValue('logoTextSlider'), getSliderValue('logoLetterSpacing'), 'logoTextEdit');
				break;
			case "logoName1":

				if (removeMultipleSpaces($('.dd-ct-line1.templateText').val()) == '') {
					$('.dd-ct-line1.templateText').val(lEditor.currentLogo.logoName1);
					return false;
				}
				if (lEditor.currentLogo.generate.logoText1Slider) {
					logoTextFS = lEditor.currentLogo.generate.logoText1Slider;
				}
				if (lEditor.currentLogo.generate.logoText1LetterSpacing) {
					logoTextLS = lEditor.currentLogo.generate.logoText1LetterSpacing;
				}
				updateLogoText("logoName1", '', logoTextFS, logoTextLS, 'logoText1Edit');
				break;
			case "logoName2":
				if (removeMultipleSpaces($('.dd-ct-line2.templateText').val()) == '') {
					$('.dd-ct-line2.templateText').val(lEditor.currentLogo.logoName2);
					return false;
				}
				if (lEditor.currentLogo.generate.logoText2Slider) {
					logoTextFS = lEditor.currentLogo.generate.logoText2Slider;
				}
				if (lEditor.currentLogo.generate.logoText2LetterSpacing) {
					logoTextLS = lEditor.currentLogo.generate.logoText2LetterSpacing;
				}
				updateLogoText("logoName2", '', logoTextFS, logoTextLS, 'logoText2Edit');
				break;
			case "undo_redo_logoName":
				updateLogoText("logo", '', lEditor.currentLogo.generate.logoTextSlider, lEditor.currentLogo.generate.logoLetterSpacing, 'undo_redo_logoName');
				break;
			case "undo_redo_logoName1":
				if (lEditor.currentLogo.generate.logoText1Slider) {
					logoTextFS = lEditor.currentLogo.generate.logoText1Slider;
				}
				if (lEditor.currentLogo.generate.logoText1LetterSpacing) {
					logoTextLS = lEditor.currentLogo.generate.logoText1LetterSpacing;
				}
				updateLogoText("logoName1", '', logoTextFS, logoTextLS, 'undo_redo_logoName1', '', p_sLogoText);
				break;
			case "undo_redo_logoName2":
				if (lEditor.currentLogo.generate.logoText2Slider) {
					logoTextFS = lEditor.currentLogo.generate.logoText2Slider;
				}
				if (lEditor.currentLogo.generate.logoText2LetterSpacing) {
					logoTextLS = lEditor.currentLogo.generate.logoText2LetterSpacing;
				}
				updateLogoText("logoName2", '', logoTextFS, logoTextLS, 'undo_redo_logoName2', '', p_sLogoText);
				break;
		}
		if (p_sType !== "") {
			editorUndoRedo.showBlocker(false);
		}
	}
	$('.removeSloganText').on('click', function (e) {
		debugConsole("removeSloganText click");
		if (removeMultipleSpaces($('#editSloganNameText').val()) != '') {
			$('#editSloganNameText').val('');
			lEditor.setSession('sloganText', '');
			lEditor.modifyLogoProperties("sloganText");
		}
	});
	/**
	 * remove sloagn name
	 */
	$('.removeSlogan').on('click', function (e) {
		debugConsole("removeSlogan click");
		$(this).addClass('hidden');
		onRemoveSlogan();
	});

	function onRemoveSlogan() {
		$('.editSloganName').val('');
		lEditor.setSession('sloganText', '');
		if (lEditor.currentLogo.generate.templatePath.isEqual == 1 && typeof lEditor.currentLogo.generate.templatePath.sloganSetAsPerText != "undefined" && lEditor.currentLogo.generate.templatePath.sloganSetAsPerText == 1) {
			lEditor.currentLogo.generate.templatePath.sloganSetAsPerText = 0;
		}

		logoMakerFunction.resetSlider("textSloganDistSlider", true);
		updateLogoText(constantVars.targets[lEditor.getSession('targetlink')], '', getSliderValue('sloganTextSize'), getSliderValue('sloganLetterSpacing'), 'remove_slogan', "remove_slogan");
	}
	// Change font family
	$('body').on('click', '.commonFont a', function (e) {
		debugConsole("commonFont click");
		$('.commonFont a').removeClass('active');
		$(this).addClass('active');
		editorParameters = {};
		editorParameters.obj = $(this);
		editorParameters.fors = constantVars.targets[lEditor.getSession('targetlink')];
		loadMoreStart = 0;
		logoByfontFamily(editorParameters);
	});
	//Change layout Section
	$('.layoutSection').on('click', 'li a', function (e) {
		debugConsole("layoutSection click");
		var dataOption = parseInt($(this).data('option'));
		var currLogo = lEditor.currentLogo;
		currLogo.generate.templateType = dataOption;
		currLogo.generate.templatePath = lEditor.sliderData.templates[dataOption];
		if (dataOption == 2) {
			currLogo.generate.iconPath = "";
		}
		lEditor.getCurrentLogo();
	});
    /**
	 * Change Frame Section
	 */
	function sessionData() {
		debugConsole('sessionData Cur step is: ' + lEditor.currentStep);
		switch (lEditor.currentStep) {

			case 1: {
				lEditor.currentStep = 2;
				break;
			}
			case 2: {
				var sampleImage = {};
				var arr = [];
				lEditor.cleanSession('sampleImage');
				$('.step_2 .active').each(function () {
					arr.push($(this).data());
				});
				sampleImage = arr;
				if (sampleImage.length != 0) {
					lEditor.setSession('sampleImage', getValidJsonStringifyObj(sampleImage));
					lEditor.currentStep = 3;
				}

				break;
			}
			case 3: {
				var sampleColor = [];
				lEditor.cleanSession('sampleColor');
				$('.step_3 .active').each(function () {
					sampleColor.push($(this).data());
				});
				lEditor.setSession('sampleColor', getValidJsonStringifyObj(sampleColor))
				lEditor.currentStep = 4;
				break;
			}

			case 4: {
				var logoName = removeMultipleSpaces($('#logoname2').val())
				var sloganText = removeMultipleSpaces($('#sloganText').val());
				var industryName = $('#industryName').val();
				var industryText = $('#industryName').text();
				if (industryName == 2010) {
					var extraIndustry = $('#extraIndustry').val();
					var industryText = $('#extraIndustry').text();
				} else {
					var extraIndustry = $('#search_industry').val();
					var industryText = $('#search_industry').val();
				}

				if (lEditor.budgetShowType == 1) {
					sessionStorage.removeItem('budgetType');
					sessionStorage.removeItem('budgetVal');
					sessionStorage.removeItem('budgetId');
					var budgetId = $('#budgetType').val();
					var budgetType = 1;
					if (budgetId == 'custom') {
						budgetType = 2;
						lEditor.setSession('budgetVal', $('#extraBudget').val());
					} else {
						lEditor.setSession('budgetId', budgetId);
					}
					lEditor.setSession('budgetType', budgetType);

				}
				if (extraIndustry.toLowerCase() == 'wedding service' || extraIndustry.toLowerCase() == 'wedding-service') {
					extraIndustry = 'wedding';
				}
				lEditor.setSession('extraIndustry', extraIndustry);
				lEditor.setSession('logoname', logoName);
				lEditor.setSession('industryId', industryName);
				lEditor.setSession('industryText', industryText);
				var getLogoName = lEditor.getSession('logoname');
				lEditor.setSession('sloganText', sloganText);
				if (getLogoName == "" || getLogoName == null || getLogoName == "undefined") {
					$(".error-text").show();
					$('.le-s-logoName').addClass('has-error');
				} else {
					$(".error-text").hide();
					$('.le-s-logoName').removeClass('has-error');
					lEditor.currentStep = 5;
					lEditor.iconsData();
				}
				break;
			}
			case 5: {
				var boxLength = 0;
				lEditor.setSession('sampleIcon', getValidJsonStringifyObj({ "si": lEditor.sampleIconArr }));
				lEditor.currentStep = 6;

				break;
			}
			case 6: {
				lEditor.currentStep = 7;
				break;
			}

			case 7: {

				break;
			}
		}

		lEditor.setSession('currPage', lEditor.currentStep);
		lEditor.showStep();
	}
	//Change Frame Section
	$('.containerShapeList').change(function () {

		loadMoreStart = 0;
		logoByContainer();
	});

	$('.containerTypeList').change(function () {
		loadMoreStart = 0;
		logoByContainer();
	});


	$('.containerIconShapeList').change(function () {
		loadMoreStart = 0;
		logoByIconContainer();
	});

	$('.containerIconTypeList').change(function () {
		loadMoreStart = 0;
		logoByIconContainer();
	});
	////////////////////////////////////////////////////////////////////////
	$('body').click(function (e) {
		var targetLen = $(e.target).closest('.containerOptions').length;
		if (targetLen == 0) {
			$('.containerOptions').removeClass('open');
			$('.containerOptions button').removeClass(' btn-purple');
		}
	});
	// Change Color Section
	$('.colorsVariant a').click(function (e) {
		$('.finalogoSlider').html('');
		editorParameters = {};
		editorParameters.id = $(this).data('id');
		editorParameters.color = $(this).data('color');
		loadMoreStart = 0;
		debugConsole("editorParameters.color:=" + editorParameters.color, true);

		updateColorPickerValue(editorParameters.color, true, "", 0);
		fixedColorVariation(editorParameters);
		$('.commonClrDiv a').removeClass('active');
		$(this).addClass('active');
		$('.previewSection').addClass('hidden');
	});

	$('.colorPaletteButton, .colorPaletteVariants a').click(function (e) {
		$('.finalogoSlider').html('');
		editorParameters = {};
		editorParameters.id = $(this).data('id');
		loadMoreStart = 0;
		palettsColorVariation(editorParameters);
		$('.commonClrDiv a, .colorPaletteButton').removeClass('active');
		$(this).addClass('active');
	});
	$('.colorPicker .colorPickerInput').blur(function (e) {
		debugConsole("colorPickerInput blur");
	});
	$('.colorPicker .colorPickerInput').focus(function (e) {
		// debugConsole("$('.colorNotFound').length:=" + $('.colorNotFound').length);
		if (removeMultipleSpaces($(this).val()) !== "") {
			$(this).attr("currentVal", $(this).val());
		}
	});
	$('.colorPicker .colorPickerInput').on('input', function (e) {
		debugConsole("colorPicker colorPickerInput");
	});

	$('.colorPicker .input-group-addon').on('click', function (e) {
		debugConsole("input-group-addon click", true);
		var currentTabTargetLink = lEditor.getSession("targetlink");
		if (currentTabTargetLink == 3 || currentTabTargetLink == "undefined") {
			currentTabTargetLink = 12;
		}
		var inputParentDiv = $(".subChild-" + currentTabTargetLink);
		if (removeMultipleSpaces(inputParentDiv.find('.colorPicker .colorPickerInput').val()) == "") {
			if ($('.finaLogoInner').children().length > 0) {
				$('.colorPicker .input-group-addon').attr("isopen", "yes");
				inputParentDiv.find('.colorPicker .colorPickerInput').val(inputParentDiv.find('.colorPicker .colorPickerInput').attr("currentVal"));
				$(".editFinalLogo").removeClass("hidden");
				$(".editLogoSlider").addClass("hidden");
			} else {

			}
		} else {
			$('.colorPicker .input-group-addon').attr("isopen", "yes");
		}
		var picker = $(this).closest('.colorPicker');
		var colorVal = picker.colorpicker('getValue');
		debugConsole("colorVal:=" + colorVal, true);
		picker.colorpicker('setValue', colorVal);

	});

	$('.colorPicker').on('colorpickerUpdate', function (e) {
		debugConsole("isopen:=" + $('.colorPicker .input-group-addon').attr("isopen"));
		if ($('.colorPicker .input-group-addon').attr("isopen") == "yes") {
			$('.colorPicker .input-group-addon').attr("isopen", "no");
			return;
		}
		debugConsole("colorpickerUpdate", true);
		var colorVal = $(this).colorpicker('getValue');
		debugConsole("colorVal:=" + colorVal);
		$('.commonClrDiv a').removeClass('active');
		$('.previewSection').addClass('hidden');

		lEditor.logoSlider('final', 1);
		try {
			colorVariation(colorVal);
			updateColorPickerValue(colorVal, true, "", 0);
		} catch (e) {
			// $('.finaLogoInner').html('');
			$('.colorNotFound').remove();
			$('.editLogoSlider').removeClass('hidden');
			$('.editFinalLogo').addClass('hidden');
			$(".finalogoSlider").html('<div class="result-option colorNotFound">Not a valid Color code !</div>');
		}
	});
	/**
	 * Handling color gradients items click
	 */
	$('.foil--variations.commonClrDiv').click(function (e) {
		debugConsole("commonClrDiv click", true);
		var color = $(this).attr('color');
		var targetLink = lEditor.getSession('targetlink');
		var picker = $(this).closest('.colorPicker');

		debugConsole("color:=" + color, true);
		if (color) {
			$('.commonClrDiv a').removeClass('active');
			$(this).find('a').addClass('active');
			colorGradient(color);
			addRecentColor(targetLink);
			//set the color of the picker
			// if (picker) {
			// 	debugConsole("getGradientStyle(color):=" + getGradientStyle(color) + ",,,," + color, true);
			// 	picker.find('.input-group-addon.color-box i')[0].style.background = getGradientStyle(color);
			// }
			updateColorPickerValue(color, false, "", 0);
		}
		$('.previewSection').removeClass('hidden');
		lEditor.previewColors();
		lEditor.previewLogo();

	});
    /**
	 *  Edit Symbol Section
	 */
	// $('.editTags').focus(function (e) {
	// 	debugConsole("editTags focus");
	// 	$('.searchContainer').css('transform', 'scale(1)');
	// });
	// $('.editSearchButton').click(function (e) {
	// 	debugConsole("editSearchButton click");
	// 	$('.searchContainer').show();
	// });

	// $('body').on('click', '.closeSearchContainer', function () {
	// 	debugConsole("closeSearchContainer click");
	// 	$('.searchContainer').css('transform', 'scale(0)');
	// });

	$('.editFinalLogo').click(function (e) {
		e.stopImmediatePropagation();
		debugConsole("editFinalLogo click");
		hideAllPopover();
	});

	function disableStep7Page(p_bValue) {
		if (p_bValue) {
			$('.step_7').css("pointer-events", "none");
		} else {
			$('.step_7').css("pointer-events", "auto");
		}

	}
	//svg js
	function getOulineJson(className) {
		if ($(".finaLogoInner ." + className).length < 1) {
			return { width: 0, height: 0, left: 0, top: 0 };
		}
		var currBBox = $(".finaLogoInner ." + className)[0].getBoundingClientRect();
		var widths = currBBox.width + 20;
		var heights = currBBox.height;
		heights = 20 + heights;

		var wid = parseFloat(widths);
		var height = parseFloat(heights);
		var divLeft = parseInt($('.svgSlideContent').offset().left);
		var divHeight = parseInt($('.svgSlideContent').offset().top);
		var left = parseInt($(".finaLogoInner ." + className).offset().left) - divLeft - 10;
		var top = parseInt($(".finaLogoInner ." + className).offset().top) - divHeight - 10;

		return { width: wid, height: height, left: left, top: top };
	}

	function updateOutlineStats() {
		var jsonObj = {};

		var currentLogo = getValidJsonParseObj(lEditor.getSession('currentLogo'));
		var currLogo = currentLogo.generate;
		if (currLogo.templatePath.isFrame != 0) {
			jsonObj.frame = getOulineJson('container_1');
		}

		if (currentLogo.generate.templatePath.isDBLineCompanyText == "yes") {
			jsonObj.text = getOulineJson('logoNameBox1');
			if (!(currentLogo.logoName2 == "" || currentLogo.logoName2 == null || typeof (currentLogo.logoName2) === "undefined")) {
				jsonObj.text2 = getOulineJson('logoNameBox2');
			}
		} else {
			if (!(currentLogo.logoName == "" || currentLogo.logoName == null || typeof (currentLogo.logoName) === "undefined")) {
				jsonObj.text = getOulineJson('logoNameBox');
			}
		}


		if (!(currentLogo.sloganName == "" || currentLogo.sloganName == null || typeof (currentLogo.sloganName) === "undefined")) {
			jsonObj.slogan = getOulineJson('sloganBox');
		}

		if ((currLogo.templatePath.isIcon != 0) || (currLogo.templatePath.isMono != 0)) {
			jsonObj.icon = getOulineJson('sampleIcons_1');
		}


		if ((currLogo.templatePath.isIconFrame != 0)) {
			jsonObj.iconFrame = getOulineJson('iconFrame');
		}

		jsonObj.backGround = getOulineJson('svgSlideContent svg');

		return jsonObj;
	}
	$('.editFinalLogo').on('mouseover', '.finaLogoInner svg', function (e) {
		var jsonObj = updateOutlineStats();
		var widForBg = parseFloat(jsonObj.backGround.width) - 40;
		var heightForBg = parseFloat(jsonObj.backGround.height) - 40;
		var leftForBg = 10;
		var topForBg = 10;
		var currentLogo = getValidJsonParseObj(lEditor.getSession('currentLogo'));
		var currLogo = currentLogo.generate;

		$('.svgBoderOutline').remove();
		if (currLogo.templatePath.isFrame != 0) {
			$('.svgSlideContent').append('<div class="svgBoderOutline svg-ouline--box svg--outline forContainer" style="width:' + jsonObj.frame.width + 'px; height:' + jsonObj.frame.height + 'px; border:1px solid transparent; z-index:7; opacity:0; left:' + jsonObj.frame.left + 'px; top:' + jsonObj.frame.top + 'px"></div>');
		}

		if (!(currentLogo.logoName == "" || currentLogo.logoName == null || typeof (currentLogo.logoName) === "undefined")) {
			$('.svgSlideContent').append('<div class="svgBoderOutline svg-ouline--box svg--outline forText1" style="width:' + jsonObj.text.width + 'px; height:' + jsonObj.text.height + 'px; border:1px solid transparent;  opacity:0; z-index:8; left:' + jsonObj.text.left + 'px; top:' + jsonObj.text.top + 'px"></div>');
			if (jsonObj.text2) {
				$('.svgSlideContent').append('<div class="svgBoderOutline svg-ouline--box svg--outline forText2" style="width:' + jsonObj.text2.width + 'px; height:' + jsonObj.text2.height + 'px; border:1px solid transparent;  opacity:0; z-index:8; left:' + jsonObj.text2.left + 'px; top:' + jsonObj.text2.top + 'px"></div>');
			}
		}

		if (!(currentLogo.sloganName == "" || currentLogo.sloganName == null || typeof (currentLogo.sloganName) === "undefined")) {
			$('.svgSlideContent').append('<div class="svgBoderOutline svg-ouline--box svg--outline forSlogan" style="width:' + jsonObj.slogan.width + 'px; height:' + jsonObj.slogan.height + 'px; border:1px solid transparent;  opacity:0; z-index:9; left:' + jsonObj.slogan.left + 'px; top:' + jsonObj.slogan.top + 'px"></div>');
		}

		if ((currLogo.templatePath.isIconFrame != 0)) {

			$('.svgSlideContent').append('<div class="svgBoderOutline svg-ouline--box svg--outline forIconFrame" style="width:' + jsonObj.iconFrame.width + 'px; height:' + jsonObj.iconFrame.height + 'px; border:1px solid transparent; opacity:0; z-index:10; left:' + jsonObj.iconFrame.left + 'px; top:' + jsonObj.iconFrame.top + 'px"></div>');
		}
		if (currLogo.templatePath.isIcon != 0 || currLogo.templatePath.isMono != 0) {
			$('.svgSlideContent').append('<div class="svgBoderOutline svg-ouline--box svg--outline forIcon" style="width:' + jsonObj.icon.width + 'px; height:' + jsonObj.icon.height + 'px; border:1px solid transparent; opacity:0; z-index:10; left:' + jsonObj.icon.left + 'px; top:' + jsonObj.icon.top + 'px"></div>');
		}

		$('.svgSlideContent').append('<div class="svgBoderOutline svg-ouline--box svg--outline forbackGround" style="width:' + widForBg + 'px; height:' + heightForBg + 'px; border:1px solid transparent; opacity:0; z-index:6; left:' + leftForBg + 'px; top:' + topForBg + 'px"></div>');
	});

	$('.editFinalLogo').on('mouseenter', '.finaLogoInner .svgBoderOutline', function (e) {
		e.stopImmediatePropagation();
		var jsonObj = updateOutlineStats();
		var widForBg = parseFloat(jsonObj.backGround.width) - 40;
		var heightForBg = parseFloat(jsonObj.backGround.height) - 40;
		var leftForBg = 10;
		var topForBg = 10;
		var classAttr = $(this).attr('class');
		$('.editFinalLogo .svgBoder').remove();
		if ($(this).hasClass('forContainer')) {
			$(this).parents('.svgSlideContent').append('<div class="svgBoder svg--outline" style="width:' + jsonObj.frame.width + 'px; height:' + jsonObj.frame.height + 'px; border:1px solid #6495ed; left:' + jsonObj.frame.left + 'px; top:' + jsonObj.frame.top + 'px"></div>');
		}
		else if ($(this).hasClass('forText1')) {
			$(this).parents('.svgSlideContent').append('<div class="svgBoder svg--outline" style="width:' + jsonObj.text.width + 'px; height:' + jsonObj.text.height + 'px; border:1px solid #6495ed; left:' + jsonObj.text.left + 'px; top:' + jsonObj.text.top + 'px"></div>');
		}
		else if ($(this).hasClass('forText2')) {
			$(this).parents('.svgSlideContent').append('<div class="svgBoder svg--outline" style="width:' + jsonObj.text2.width + 'px; height:' + jsonObj.text2.height + 'px; border:1px solid #6495ed; left:' + jsonObj.text2.left + 'px; top:' + jsonObj.text2.top + 'px"></div>');
		}
		else if ($(this).hasClass('forSlogan')) {
			$(this).parents('.svgSlideContent').append('<div class="svgBoder svg--outline" style="width:' + jsonObj.slogan.width + 'px; height:' + jsonObj.slogan.height + 'px; border:1px solid #6495ed; left:' + jsonObj.slogan.left + 'px; top:' + jsonObj.slogan.top + 'px"></div>');
		}
		else if ($(this).hasClass('forIconFrame')) {
			$(this).parents('.svgSlideContent').append('<div class="svgBoder svg--outline" style="width:' + jsonObj.iconFrame.width + 'px; height:' + jsonObj.iconFrame.height + 'px; border:1px solid #6495ed; left:' + jsonObj.iconFrame.left + 'px; top:' + jsonObj.iconFrame.top + 'px"></div>');
		}
		else if ($(this).hasClass('forIcon')) {
			$(this).parents('.svgSlideContent').append('<div class="svgBoder svg--outline" style="width:' + jsonObj.icon.width + 'px; height:' + jsonObj.icon.height + 'px; border:1px solid #6495ed; left:' + jsonObj.icon.left + 'px; top:' + jsonObj.icon.top + 'px"></div>');
		}

		else if ($(this).hasClass('forbackGround')) {
			$(this).parents('.svgSlideContent').append('<div class="svgBoder svg--outline" style="width:' + widForBg + 'px; height:' + heightForBg + 'px; border:1px solid #6495ed; left:' + leftForBg + 'px; top:' + topForBg + 'px"></div>');
		}

	});

	$('.editFinalLogo').on('click', '.finaLogoInner .svgBoderOutline', function (e) {
		debugConsole("editFinalLogo click");

		e.stopImmediatePropagation();
		var targetLink, defaultlink, left, top, wid, height;
		var jsonObj = updateOutlineStats();
		var targetLink = lEditor.getSession('targetlink');
		var parentLink = lEditor.getSession('parentlink');

		jsonObj.backGround.width = parseFloat(jsonObj.backGround.width) - 40;
		jsonObj.backGround.height = parseFloat(jsonObj.backGround.height) - 40;
		jsonObj.backGround.top = 10;
		jsonObj.backGround.left = 10;
		var boundary = {};

		var classAttr = $(this).attr('class');
		$('.editFinalLogo .svgBoderActive').remove();

		if ($(this).hasClass('forContainer')) {
			$(this).parents('.svgSlideContent').append('<div class="svgBoderActive svg--outline" style="width:' + jsonObj.frame.width + 'px; height:' + jsonObj.frame.height + 'px; border:1px solid lime; left:' + jsonObj.frame.left + 'px; z-index:11; top:' + jsonObj.frame.top + 'px"></div>');
			if (parseInt(targetLink) == 3 || parseInt(parentLink) == 3) {
				$('.subMenu-16').trigger('click');
				//var getSessionDft = $('[data-target="16"').offset().left;
				//$('.subMenuSection .table-menu').stop().animate({scrollLeft : getSessionDft });
			}
			else {
				$('.topParent-6').trigger('click');
				lEditor.setSession('defaultlink', 24);

				// var getSessionDft = $('.topParent-6').offset().left;
				// $('.tabel-menu-1').stop().animate({scrollLeft : getSessionDft }); 
			}

			boundary = jsonObj.frame;

		}
		else if ($(this).hasClass('forText1')) {
			$(this).parents('.svgSlideContent').append('<div class="svgBoderActive svg--outline" style="width:' + jsonObj.text.width + 'px; height:' + jsonObj.text.height + 'px; border:1px solid lime; left:' + jsonObj.text.left + 'px; z-index:11; top:' + jsonObj.text.top + 'px"></div>');
			if (parseInt(targetLink) == 3 || parseInt(parentLink) == 3) {
				$('.subMenu-13').trigger('click');
				// var getSessionDft = $('[data-target="13"').offset().left;
				// $('.subMenuSection .table-menu').stop().animate({scrollLeft : getSessionDft });
			}
			else {
				$('.topParent-2').trigger('click');

				// var getSessionDft = $('[data-target="7"').offset().left;
				// $('.subMenuSection .table-menu').stop().animate({scrollLeft : getSessionDft });

				// var getSessionTgt = $('.topParent-2').offset().left - 30;
				//$('.tabel-menu-1').stop().animate({scrollLeft : getSessionTgt });
			}

			boundary = jsonObj.text;

		}
		else if ($(this).hasClass('forText2')) {
			$(this).parents('.svgSlideContent').append('<div class="svgBoderActive svg--outline" style="width:' + jsonObj.text2.width + 'px; height:' + jsonObj.text2.height + 'px; border:1px solid lime; left:' + jsonObj.text2.left + 'px; z-index:11; top:' + jsonObj.text2.top + 'px"></div>');
			if (parseInt(targetLink) == 3 || parseInt(parentLink) == 3) {
				$('.subMenu-13').trigger('click');
				// var getSessionDft = $('[data-target="13"').offset().left;
				// $('.subMenuSection .table-menu').stop().animate({scrollLeft : getSessionDft });
			}
			else {
				$('.topParent-2').trigger('click');

				// var getSessionDft = $('[data-target="7"').offset().left;
				// $('.subMenuSection .table-menu').stop().animate({scrollLeft : getSessionDft });

				// var getSessionTgt = $('.topParent-2').offset().left - 30;
				//$('.tabel-menu-1').stop().animate({scrollLeft : getSessionTgt });
			}
			boundary = jsonObj.text2;
		}
		else if ($(this).hasClass('forSlogan')) {
			$(this).parents('.svgSlideContent').append('<div class="svgBoderActive svg--outline" style="width:' + jsonObj.slogan.width + 'px; height:' + jsonObj.slogan.height + 'px; border:1px solid lime; left:' + jsonObj.slogan.left + 'px; z-index:11; top:' + jsonObj.slogan.top + 'px"></div>');
			if (parseInt(targetLink) == 3 || parseInt(parentLink) == 3) {
				$('.subMenu-14').trigger('click');
				// var getSessionDft = $('[data-target="14"').offset().left;
				// $('.subMenuSection .table-menu').stop().animate({scrollLeft : getSessionDft });
			}
			else {
				$('.topParent-2').trigger('click');
				lEditor.setSession('defaultlink', 9);
				lEditor.setSession('targetlink', 9);

				//  var getSessionDft = $('[data-target="9"').offset().left;
				// $('.subMenuSection .table-menu').stop().animate({scrollLeft : getSessionDft });

				//  var getSessionTgt = $('.topParent-2').offset().left - 30;
				//  $('.tabel-menu-1').stop().animate({scrollLeft : getSessionTgt });
			}

			boundary = jsonObj.slogan;

		}

		else if ($(this).hasClass('forIcon')) {
			$(this).parents('.svgSlideContent').append('<div class="svgBoderActive svg--outline" style="width:' + jsonObj.icon.width + 'px; height:' + jsonObj.icon.height + 'px; border:1px solid lime; left:' + jsonObj.icon.left + 'px; z-index:11; top:' + jsonObj.icon.top + 'px"></div>');
			if (parseInt(targetLink) == 3 || parseInt(parentLink) == 3) {
				$('.subMenu-15').trigger('click');
				//  var getSessionDft = $('[data-target="15"').offset().left;
				// $('.subMenuSection .table-menu').stop().animate({scrollLeft : getSessionDft });
			}
			else {
				$('.topParent-5').trigger('click');
				//  var getSessionTgt = $('[data-target="5"]').offset().left - 30;
				// $('.tabel-menu-1').stop().animate({scrollLeft : getSessionTgt });

			}
			boundary = jsonObj.icon;

		}
		else if ($(this).hasClass('forIconFrame')) {
			$(this).parents('.svgSlideContent').append('<div class="svgBoderActive svg--outline" style="width:' + jsonObj.iconFrame.width + 'px; height:' + jsonObj.iconFrame.height + 'px; border:1px solid lime; left:' + jsonObj.iconFrame.left + 'px; z-index:11; top:' + jsonObj.iconFrame.top + 'px"></div>');
			if (parseInt(targetLink) == 3 || parseInt(parentLink) == 3) {
				$('.subMenu-43').trigger('click');
				//  var getSessionDft = $('[data-target="43"').offset().left;
				//$('.subMenuSection .table-menu').stop().animate({scrollLeft : getSessionDft });
			}
			else {
				$('.topParent-6').trigger('click');
				lEditor.setSession('defaultlink', 40);

				// var getSessionTgt = $('[data-target="5"]').offset().left;
				//  $('.tabel-menu-1').stop().animate({scrollLeft : getSessionTgt });

			}
			boundary = jsonObj.iconFrame;

		}
		else if ($(this).hasClass('forbackGround')) {
			$(this).parents('.svgSlideContent').append('<div class="svgBoderActive svg--outline" style="width:' + jsonObj.backGround.width + 'px; height:' + jsonObj.backGround.height + 'px; border:1px solid lime; left:' + jsonObj.backGround.left + 'px; z-index:11; top:' + jsonObj.backGround.top + 'px"></div>');
			$('.topParent-3').trigger('click');

			// var getSessionDft = $('[data-target="12"').offset().left;
			// $('.subMenuSection .table-menu').stop().animate({scrollLeft : getSessionDft });

			// var getSessionTgt = $('.topParent-3').offset().left - 30;
			// $('.tabel-menu-1').stop().animate({scrollLeft : getSessionTgt });

			boundary = jsonObj.backGround;

		}


		lEditor.setSession('boundary', getValidJsonStringifyObj(boundary));
		debugConsole("editLogoSteps4");
		lEditor.editLogoSteps();

	});

	$('.editFinalLogo').on('mouseleave', '.svgBoderOutline', function (e) {
		$('.editFinalLogo .svgBoder').remove();
	});

	$('.editFinalLogo').on('mouseleave', '.svgSlideContent', function (e) {
		$('.editFinalLogo .svgBoderOutline').remove();
	});

	$('body').click(function (e) {
		if ($('.editFinalLogo .svgBoderActive').length) {
			debugConsole("body click111");
			$('.editFinalLogo .svgBoderActive').remove();
		}
	});

	function clearOutlineBox() {
		lEditor.cleanSession('boundary');

	}

	function clearOutline() {
		$('.svgBoderActive').remove();
	}
	/*=== For too long text ===*/
	$(".editTags").on('paste keyup input', function () {
		debugConsole("editTags paste keyup input");
	});

	$("#logoname2").on('paste keyup input', function () {
		debugConsole("logoname2 input");
		var inp_txt = $(this).val().trim();
		var inp_len = inp_txt.length;
		//debugConsole(inp_len);
		//var getLength = $(this).val().trim().length;

		if (inp_len >= 17) {
			$(".error-text1").show();
			$(".error-text").hide();
			$('.le-s-logoName').addClass('has-warning').removeClass('has-success has-error');
		}
		else if (inp_len == 0) {
			$(".error-text").show();
			$(".error-text1").hide();
			$('.le-s-logoName').addClass('has-error').removeClass('has-success has-warning');

		}
		else {
			$(".error-text1").hide();
			$(".error-text").hide();
			$('.le-s-logoName').addClass('has-success').removeClass('has-error has-warning');
		}
	});

	$("#sloganText").on('paste keyup', function () {
		var getLength = $(this).val().length;
		if (getLength >= 30) {
			$(".error-text2").show();
			$('.le-s-sloganName').addClass('has-warning');
		}
		else {
			$(".error-text2").hide();
			$('.le-s-sloganName').removeClass('has-warning');
		}
	});

	/*=== For too long text ===*/
	/*=== Set Default Section ===*/

	$('body').on('click', '.setDefaultLogo', function (e) {
		var type = $(this).data('type');
		debugConsole("setDefaultLogo:=" + type + ",,,," + $(this).data('id'));
		hideAllPopover();
		var getTargetLink = parseInt(lEditor.getSession('targetlink'));
		debugConsole("getTargetLink:=" + getTargetLink);
		switch (type) {
			case "frame":
				if (getTargetLink !== 44) {
					logoMakerFunction.resetSlider("frameSizeSlider");
				}
				if (getTargetLink === 40) {
					logoMakerFunction.resetSlider("logoSizeSlider");
					logoMakerFunction.resetSlider("iconDistanceSlider");

					logoMakerFunction.resetSlider("sloganTextSize");
					logoMakerFunction.resetSlider("sloganLetterSpacing");
					logoMakerFunction.resetSlider("textSloganDistSlider");
				}
				if (getTargetLink === 24) {
					logoMakerFunction.resetSlider("textSloganDistSlider");
				}
				if (getTargetLink === 44) {
					logoMakerFunction.resetSlider("logoSizeSlider")
				}
				if (getTargetLink === 42) {
					logoMakerFunction.resetSlider("logoSizeSlider");
					logoMakerFunction.resetSlider("textSloganDistSlider")
				}
				break;

			case "color":
				//getTargetLink:=3
				//getTargetLink:=13
				//getTargetLink:=14
				//getTargetLink:=15
				//getTargetLink:=43
				//getTargetLink:=26
				//getTargetLink:=16

				if (getTargetLink == 29) {
					logoMakerFunction.resetSlider("sloganTextSize");
					logoMakerFunction.resetSlider("sloganLetterSpacing");
					logoMakerFunction.resetSlider("textSloganDistSlider");
					logoMakerFunction.resetSlider("logoSizeSlider");
					logoMakerFunction.resetSlider("iconDistanceSlider");
					logoMakerFunction.resetSlider("frameSizeSlider");
				}

				// if (getTargetLink !== 14 && getTargetLink !== 3) {
				// 	logoMakerFunction.resetSlider("sloganTextSize");
				// 	logoMakerFunction.resetSlider("sloganLetterSpacing");
				// 	logoMakerFunction.resetSlider("textSloganDistSlider");
				// }


				// if (getTargetLink !== 15) {
				// 	logoMakerFunction.resetSlider("logoSizeSlider");
				// 	logoMakerFunction.resetSlider("iconDistanceSlider");
				// }
				// if (getTargetLink !== 16 && getTargetLink !== 26) {
				// 	logoMakerFunction.resetSlider("frameSizeSlider");
				// }
				break;

			case "logo":
				if (getTargetLink == 8) {
					// logoMakerFunction.resetSlider("logoTextSlider");
					// logoMakerFunction.resetSlider("logoLetterSpacing");
				} else {
					logoMakerFunction.resetSlider("logoTextSlider");
					logoMakerFunction.resetSlider("logoLetterSpacing");
				}
				break;

			case "slogan":
				if (getTargetLink == 10) {

				} else {
					logoMakerFunction.resetSlider("sloganTextSize");
					logoMakerFunction.resetSlider("sloganLetterSpacing");
					logoMakerFunction.resetSlider("textSloganDistSlider");
				}

				break;
			case "monogram-update":
				logoMakerFunction.resetSlider("iconDistanceSlider");
				if (getTargetLink !== 39) {
					logoMakerFunction.resetSlider("frameSizeSlider");
					logoMakerFunction.resetSlider("logoSizeSlider");
				}
				if (getTargetLink === 32) {
					logoMakerFunction.resetSlider("sloganTextSize");
					logoMakerFunction.resetSlider("sloganLetterSpacing");
					logoMakerFunction.resetSlider("textSloganDistSlider");
				}
				if (getTargetLink == 39) {
					logoMakerFunction.resetSlider("logoSizeSlider");
				}
				break;

			case "icon":
				if (getTargetLink === 27) {
					logoMakerFunction.resetSlider("logoSizeSlider");
					logoMakerFunction.resetSlider("iconDistanceSlider");
					logoMakerFunction.resetSlider("textSloganDistSlider");
				}
				else if (getTargetLink === 31) {
					if (lEditor.currentLogo.generate.templatePath.isFrame == 1) {
						logoMakerFunction.resetSlider("logoTextSlider");
					}
					logoMakerFunction.resetSlider("sloganTextSize");
					logoMakerFunction.resetSlider("sloganLetterSpacing");
					logoMakerFunction.resetSlider("textSloganDistSlider");
					logoMakerFunction.resetSlider("frameSizeSlider");
					logoMakerFunction.resetSlider("logoSizeSlider");
				}
				break;

			case undefined:
				logoMakerFunction.resetSlider("logoTextSlider");
				logoMakerFunction.resetSlider("logoLetterSpacing");

				logoMakerFunction.resetSlider("sloganTextSize");
				logoMakerFunction.resetSlider("sloganLetterSpacing");

				logoMakerFunction.resetSlider("textSloganDistSlider");

				logoMakerFunction.resetSlider("logoSizeSlider");
				logoMakerFunction.resetSlider("iconDistanceSlider");

				logoMakerFunction.resetSlider("frameSizeSlider");
				break;

		}
		lEditor.saveDefaultLogo($(this).data('id'), type, getTargetLink);
		if (type == 'logo') {
			lEditor.updateFontsObject('logo');
			lEditor.updateFontsObject('logoName2');
		} else if (type == 'slogan') {
			lEditor.updateFontsObject('slogan');
		}
		var tempLogoId = $(this).parents('.logoSlides').find('.iconFav').attr('data-logo-id');
		if (tempLogoId > 0) {
			lEditor.setCurrentLogoId(tempLogoId);
		}
		$('.setDefaultLogo').removeClass('active');
		$(this).addClass('active');
		lEditor.alertMessages('success', 'Saving');


		if (type == 'color') {
			addRecentColor(getTargetLink);
			$('.previewSection').removeClass('hidden');
			lEditor.previewColors();
			lEditor.previewLogo();

		}

		if (type == undefined) {
			// case when we go in generate more logos and click on update to this button


		}

		switch (getTargetLink) {
			case 8: {
				$('.topParent-2').trigger('click');
				break;
			}
			case 10: {
				$('.topParent-2').trigger('click');
				lEditor.setSession('defaultlink', 9);
				lEditor.setSession('targetlink', 9);
				break;
			}
			case 42:
			case 24: {
				$('.topParent-6').trigger('click');
				lEditor.setSession('targetlink', 6);
				lEditor.setSession('defaultlink', 24);
				$(".containerOptions").removeClass('active');
				break;
			}
			case 44:
			case 40: {
				$('.topParent-6').trigger('click');
				lEditor.setSession('targetlink', 6);
				lEditor.setSession('defaultlink', 40);
				$(".innerContainerOptions").removeClass('active');
				break;
			}
			case 29: {

				lEditor.setSession('targetlink', 1);
				$('.topParent-2').trigger('click');
				break;
			}
			case 30: {
				$('.topParent-2').trigger('click');
				break;
			}
			case 26: {
				$('.topParent-2').trigger('click');
				break;
			}
			case 3: {
				$('.topParent-3').trigger('click');
				break;
			}
			case 5:
			case 27: {
				$('.subMenu-31').trigger('click');
				break;
			}
			case 39:
			case 32: {
				$('.subMenu-32').trigger('click');
				$('.previewSection').removeClass('hidden');
				break;
			}
			case 13:
			case 14:
			case 15:
			case 16: {
				$('.topParent-3').trigger('click');
				lEditor.setSession('defaultlink', 12);
				break;
			}
		}

		if (type == undefined) {
			// logoMakerFunction.resetSildersNew("companyname");
			// logoMakerFunction.resetSildersNew("companyslogan");
			lEditor.updateFontsObject('logo')
				.then(_ => {
					lEditor.updateFontsObject('logoName2').then(_ => {
						lEditor.updateFontsObject('slogan').then(_ => {
							lEditor.updateFontsObject('mono').then(_ => {
								debugConsole("editLogoSteps5");
								lEditor.editLogoSteps();
							});
						});
					});
				})
		} else {
			debugConsole("editLogoSteps6");
			lEditor.editLogoSteps();
		}
	});

	$('.iconClose').click(function (e) {
		$('.commonNotification').removeClass('active');
	});

	$('.removeIcon').click(function (e) {
		debugConsole("removeIcon");
		var currLogo = lEditor.currentLogo;
		currLogo.generate.iconPath = "";
		currLogo.generate.templatePath.isIcon = 0;
		var returnObj = logoMakerFunction.generateLogoTemplate(currLogo.generate);
		lEditor.setDefaultLogo(currLogo, currLogo.generate);
		lEditor.getCurrentLogo();

	});


	/*=== Buy Now Button ====*/
	$('.buyNowBtn, .previewPurchase, .previewGetstarted').click(function (e) {
		debugConsole("previewPurchase click");
		e.stopImmediatePropagation();
		goForPurchase();

	});

	function goForPurchase() {
		if (DH.isLogged == 0 && DH.userId == 0) {
			clearTimeout(loginPopupTimer);
			userLoginPopup();
			$('body').addClass('logo-modal-unset');
			return;
		}
		showWarning = false;

		debugConsole("currentStep:=" + lEditor.currentStep);
		var dataAnalysisObj = getDataAnalsyis(selectedLogo, false);

		if (lEditor.currentStep == 6) {
			var numId = parseInt($(".step6-preview-section").find('.finaLogoInner').attr("currentid"));
			var selectedLogo = lEditor.logoTempArr[numId];
			jqXHR = $.ajax({
				url: DH.baseURL + '/logoMakerAjax.php',
				type: 'POST',
				beforeSend: function () {
				},
				data: { action: 'save', logo_id: 0, 'curr_logo': lEditor.validateJSON(selectedLogo, dataAnalysisObj), 'svg_logo': logoMakerFunction.getFinalLogoTemplate(selectedLogo.generate), data_analysis: dataAnalysisObj, exceptions: JSON.stringify(createLogging("at step_6 on purchase click")) },
				async: true,
				success: function (json) {
					json = getValidJsonParseObj(json);
					if (json.status == 0) {
						dh_utility_common.alert({ type: 'error', message: 'Cannot purchase selected logo.' });
					} else {
						var retLogoId = json.data.logo_id;
						debugConsole("retLogoId:=" + retLogoId);
						window.location.href = DH.baseURL + '/tools/logo-maker/payment?logoid=' + (parseInt(retLogoId) * 11);
					}
					clearException();
				},
				error: function (jqXHR, textStatus, errorThrown) {
				}
			});
		} else {
			if (lEditor.getCurrentLogoId() == 'undefined') {
				debugConsole("at step 7 logo id is " + lEditor.getCurrentLogoId());
			} else {
				var logoId = lEditor.getCurrentLogoId();
				logoId = parseInt(logoId) * 11;
				window.location.href = DH.baseURL + '/tools/logo-maker/payment?logoid=' + logoId;
			}
		}
	}

	$('.downloadFilesBtn').click(function () {
		if (lEditor.getCurrentLogoId() != 'undefined') {
			var logoId = lEditor.getCurrentLogoId();
			logoId = parseInt(logoId) * 11;

			window.location = DH.baseURL + '/my-logos/files/' + logoId;
		}
	});


	Array.prototype.containObject = function (obj) {
		var i = this.length;
		while (i--) {
			if (this[i] === obj) {
				return true;
			}
		}
		return false;
	}
    /**
	 * 
	 * @param {*} p_sType 
	 */
	function addEditOptions(p_sType) {
		debugConsole("addEditOptions p_sType:=" + p_sType);
		switch (p_sType) {
			case "icon":
				$('.iconVsTextSlider').removeClass('disabled');
				$('[data-option=".symbolContainer"]').text('Edit Symbol');
				$('[data-option=".symbolVariations"]').text('Change Symbol');
				$('.iconDistanceSlider, .iconVsTextSlider, .logoSizeSlider').removeClass('disabled');
				break;
			case "mono":
				$('.iconVsTextSlider').removeClass('disabled');
				$('[data-option=".monogramContainer"]').text('Edit Monogram');
				$('[data-option=".monoVariations"]').text('Change Monogram');
				$('.iconDistanceSlider, .iconVsTextSlider, .logoSizeSlider').removeClass('disabled');
				break;
			case "outer_frame":
				$('.frameSizeSlider').removeClass('disabled');
				break;
			case "all":
				var currentLogo = getValidJsonParseObj(lEditor.getSession('currentLogo'));
				var currLogo = currentLogo.generate;
				if (currLogo.templatePath.isIcon != 1) {
					$('.iconVsTextSlider').addClass('disabled');
					$('[data-option=".symbolContainer"]').text('Add Symbol');
					$('.iconDistanceSlider, .iconVsTextSlider, .logoSizeSlider').addClass('disabled');
				} else {
					$('.iconVsTextSlider').removeClass('disabled');
					$('[data-option=".symbolContainer"]').text('Edit Symbol');
					$('[data-option=".symbolVariations"]').text('Change Symbol');
					$('.iconDistanceSlider, .iconVsTextSlider, .logoSizeSlider').removeClass('disabled');
				}

				if (currLogo.templatePath.isMono != 1) {
					$('.iconVsTextSlider').addClass('disabled');
					$('[data-option=".monogramContainer"]').text('Add Monogram');
				} else {
					$('.iconVsTextSlider').removeClass('disabled');
					$('[data-option=".monogramContainer"]').text('Edit Monogram');
					$('[data-option=".monoVariations"]').text('Change Monogram');
					$('.iconDistanceSlider, .iconVsTextSlider, .logoSizeSlider').removeClass('disabled');
				}

				if (currLogo.templatePath.isMono != 1 && currLogo.templatePath.isIcon != 1) {
					$(".subMenu-40").parent().addClass('disabled');
				} else {
					$(".subMenu-40").parent().removeClass('disabled');

				}
				if (currLogo.templatePath.isFrame != 1) {
					$('.frameSizeSlider').addClass('disabled');

				} else {
					$('.frameSizeSlider').removeClass('disabled');
				}
				break;
		}
	}
	// logo listing by icon frames   

	function logoByIconContainer(p_fCallBack) {
		var limit = 10;
		var dataOption = $('.containerSection li.active a').data('frame');
		var currLogo = lEditor.currentLogo;
		var currContainerBodyObj = currLogo.generate.templatePath.updates.containerBody;
		var isFrameExist = currLogo.generate.templatePath.isFrame;
		debugConsole("logoByIconContainer dataOption:=" + dataOption);
		if (dataOption == 'none') {

			// lEditor.getCurrentLogo();
			// lEditor.setDefaultLogo(currLogo, currLogo.generate);
			// $('#saveIcon').trigger('click');
			var currLogo = getValidJsonParseObj(lEditor.getSession('currentLogo'));

			let oldLogoObj = getValidJsonParseObj(lEditor.getSession('currentLogo'));




			currLogo.iconFrameId = "";
			currLogo.generate.iconFramePath = "";
			currLogo.generate.templatePath.isIconFrame = 0;
			lEditor.getCurrentLogo();
			lEditor.setDefaultLogo(currLogo, currLogo.generate);

			var logoTemp = getValidJsonParseObj(lEditor.getSession('currentLogo'));


			var isIcon = 0;
			var isMono = 0;
			var isFrame = 0;
			var isIconFrame = 0;
			var isEqual = 0;
			if (typeof logoTemp.generate.templatePath.isIcon !== "undefined") {
				isIcon = logoTemp.generate.templatePath.isIcon;
			}
			if (typeof logoTemp.generate.templatePath.isMono !== "undefined") {
				isMono = logoTemp.generate.templatePath.isMono;
			}
			if (typeof logoTemp.generate.templatePath.isFrame !== "undefined") {
				isFrame = logoTemp.generate.templatePath.isFrame;
			}
			if (typeof logoTemp.generate.templatePath.isIconFrame !== "undefined") {
				isIconFrame = logoTemp.generate.templatePath.isIconFrame;
			}
			if (typeof logoTemp.generate.templatePath.isEqual !== "undefined") {
				isEqual = logoTemp.generate.templatePath.isEqual;
			}
			var isFrameExist = logoTemp.generate.templatePath.isFrame;
			var type = 0;

			var isDBLineCompanyText = "no";
			if (logoTemp.generate.templatePath.isDBLineCompanyText == "yes") {
				isDBLineCompanyText = logoTemp.generate.templatePath.isDBLineCompanyText;
			}
			switch (logoTemp.generate.templatePath.iconFrame.type) {
				case "center":
					switch (logoTemp.generate.templatePath.iconFrame.yType) {
						case "up":
							type = 4;
							break;
						case "down":
							type = 0;
							break;
					}
					break;
				case "left":
					type = 1;
					break;
				case "right":
					type = 2;
					break;
			}

			var templates = getTemplatesByType(type, isIcon, isMono, isFrame, isIconFrame, isEqual, isDBLineCompanyText)[0];

			$.each(templates, function (k, v) {
				logoTemp.generate.templatePath = v;
				logoTemp.generate.templatePath.frameType = currLogo.generate.templatePath.frameType;
				logoTemp.generate.templatePath.frameOverlap = currLogo.generate.templatePath.frameOverlap;
				logoTemp.generate.templatePath.sloganSetAsPerText = currLogo.generate.templatePath.sloganSetAsPerText;
				logoTemp.generate.templatePath.isDBLineCompanyText = currLogo.generate.templatePath.isDBLineCompanyText;
				if (isFrameExist == 1) {
					logoTemp.generate.templatePath.frame_width = currLogo.generate.templatePath.frame_width;
					logoTemp.generate.templatePath.frame_height = currLogo.generate.templatePath.frame_height;
					logoTemp.generate.templatePath.frameShapeName = currLogo.generate.templatePath.frameShapeName;
					logoTemp.generate.templatePath.frmId = currLogo.generate.templatePath.frmId;
				}
				var idKey = logoMakerFunction.genRandomId();
				logoTemp.generate.idKey = idKey;

				debugConsole("currContainerBodyObj:=" + currContainerBodyObj);
				//var returnObj = logoMakerFunction.generateLogoTemplate(logoTemp.generate, idKey, null, null, currContainerBodyObj, true, "innerContainerRemove"); comment to solved DW-2015
				var returnObj = logoMakerFunction.generateLogoTemplate(logoTemp.generate, idKey, null, null, null, true, "innerContainerRemove");
				logoTemp.generate = returnObj.logoObj;
				$('.finaLogoInner').html('<div class="svg-slide--content svgSlideContent"><div class="water-mark-img"></div>' + returnObj.html + '<div class="bgOutlineBox bg-outline-box"></div></div>');
				currObj = updateCurrLogoObject(logoTemp);
				lEditor.setDefaultLogo(currObj, currObj.generate, function () {
					let newLogoObj = getValidJsonParseObj(lEditor.getSession('currentLogo'));
					editorUndoRedo.setUndoActData(INNER_CONTAINER_REMOVE, oldLogoObj, newLogoObj)
				});
			});
			addEditOptions("all");
			$('#saveIcon').trigger('click');
		}

		if (dataOption == 'inner') {
			var frameList = [];

			var i = 0;

			var type = 'iconFrame';
			loadMoreStart++;

			if (loadMoreStart == 1) {
				lEditor.logoTempArr = [];
				lEditor.logoSlider('final', 1);
			}

			var j = (loadMoreStart - 1) * 10;

			jqXHR = $.ajax({
				url: DH.baseURL + '/logoMakerAjax.php',
				type: 'POST',
				data: { action: 'iconframes', 'type': $('.containerIconTypeList').val(), 'shape': $('.containerIconShapeList').val(), start: loadMoreStart },
				async: true,
				success: function (json) {
					// $('.load--more--class').remove();
					json = getValidJsonParseObj(json);
					if (json.status == 0) {

					} else {
						var frameList = json.data.frames;
						var frameLength = frameList.length;
						if (frameLength == 0) {
							return false;
						}
						var templateIdStyle = getTempStyle();

						$.each(frameList, function (k, v) {
							var tempType = "new";
							var logoTemp = getValidJsonParseObj(lEditor.getSession('currentLogo'));
							logoTemp.iconFrameId = v.icon_frame_id;
							logoTemp.generate.iconFramePath = v.icon_frame_svg;
							if (logoTemp.generate.templatePath.isIconFrame == 1) {
								logoTemp.generate.templatePath.sloganSetAsPerText = logoTemp.generate.templatePath.sloganSetAsPerText;
								tempType = "old";
							} else {
								var isMono = 0;
								var isIcon = 0;
								var isFrame = 0;
								var isIconFrame = 1;
								var isEqual = 0;
								var frameType = "";
								var frameOverlap = "";
								var frame_width = "";
								var frame_height = "";
								var frameShapeName = "";
								var frmId = "";
								var templateDirection = "";
								var sloganSetAsPerText = 0;
								debugConsole("frameType111:=" + logoTemp.generate.templatePath.frameType);
								if (typeof logoTemp.generate.templatePath.isFrame !== "undefined") {
									isFrame = logoTemp.generate.templatePath.isFrame;  // have tobechange
								}
								if (typeof logoTemp.generate.templatePath.isIcon !== "undefined") {
									isIcon = logoTemp.generate.templatePath.isIcon;
								}
								if (typeof logoTemp.generate.templatePath.isMono !== "undefined") {
									isMono = logoTemp.generate.templatePath.isMono;
								}
								if (typeof logoTemp.generate.templatePath.isEqual !== "undefined") {
									isEqual = logoTemp.generate.templatePath.isEqual;
								}
								if (logoTemp.generate.templatePath.frameType !== "") {
									frameType = logoTemp.generate.templatePath.frameType;
								}
								if (logoTemp.generate.templatePath.frameOverlap !== "") {
									frameOverlap = logoTemp.generate.templatePath.frameOverlap;
								}
								if (logoTemp.generate.templatePath.frame_width !== "") {
									frame_width = logoTemp.generate.templatePath.frame_width;
								}
								if (logoTemp.generate.templatePath.frame_height !== "") {
									frame_height = logoTemp.generate.templatePath.frame_height;
								}
								if (logoTemp.generate.templatePath.frameShapeName !== "") {
									frameShapeName = logoTemp.generate.templatePath.frameShapeName;
								}
								if (logoTemp.generate.templatePath.frmId !== "") {
									frmId = logoTemp.generate.templatePath.frmId;
								}
								if (typeof logoTemp.generate.templatePath.template_direction !== "undefined") {
									templateDirection = logoTemp.generate.templatePath.template_direction;

								}
								if (typeof logoTemp.generate.templatePath.sloganSetAsPerText !== "undefined") {
									sloganSetAsPerText = logoTemp.generate.templatePath.sloganSetAsPerText;

								}
								var isDBLineCompanyText = "no";
								if (logoTemp.generate.templatePath.isDBLineCompanyText == "yes") {
									isDBLineCompanyText = logoTemp.generate.templatePath.isDBLineCompanyText;
								}
								var templates = getTemplatesByType(templateDirection, isIcon, isMono, isFrame, isIconFrame, isEqual, isDBLineCompanyText)[0];
								logoTemp.generate.templatePath = templates[0];
								logoTemp.generate.templatePath.frameType = frameType;
								logoTemp.generate.templatePath.frameOverlap = frameOverlap;
								logoTemp.generate.templatePath.frame_width = frame_width;
								logoTemp.generate.templatePath.frame_height = frame_height;
								logoTemp.generate.templatePath.frameShapeName = frameShapeName;
								logoTemp.generate.templatePath.frmId = frmId;
								logoTemp.generate.templatePath.sloganSetAsPerText = sloganSetAsPerText;
								logoTemp.generate.templatePath.isDBLineCompanyText = isDBLineCompanyText;
								debugConsole("frameType2222:=" + logoTemp.generate.templatePath.sloganSetAsPerText);
							}


							var idKey = logoMakerFunction.genRandomId();
							logoTemp.generate.idKey = idKey;
							var returnObj = null;
							debugConsole("tempType111:=" + tempType);
							if (tempType == "old") {
								returnObj = logoMakerFunction.generateLogoTemplateByOption(logoTemp, type, idKey, null, null, "changeIconFrameContainer");
								logoTemp.generate = returnObj.logoObj;
							} else {
								returnObj = logoMakerFunction.generateLogoTemplate(logoTemp.generate, idKey, null, null, null, true, "addInnerContainer");
								logoTemp.generate = returnObj.logoObj;
							}
							currObj = updateCurrLogoObject(logoTemp);
							lEditor.logoTempArr[j] = getValidJsonParseObj(getValidJsonStringifyObj(currObj));

							var templateHint = showLogoAdminIds(logoTemp.generate.templatePath, logoTemp.sloganName, logoTemp.fId, logoTemp.cpId, logoTemp.sfId, logoTemp.frmId, logoTemp.iconFrameId, logoTemp.monofId);

							slickElement = '<div class="logos--boxes" data-frmid = "' + v.icon_frame_id + '"><div class="item logo--slides logoSlides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="logoSlide-overlay gradient-div"><a href="javascript:;" class="icons-edit icons-update setDefaultLogo" data-type = "frame" data-id="' + (j++) + '"><span>Update to this</span></a></div><div class="svg--slide" style="background-color:' + logoTemp.generate.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + returnObj.html + '</div></div></div></div>';
							$(".finalogoSlider").append(slickElement);
							dh_utility_common.changeBg();
							i++;
							if (json.pagination == 1 && i == frameLength) {
								if ($('.load--more--class').length) {
									$('.load--more--class').remove();
								}
								$(".finalogoSlider").append('<div class="load--more--class"><a class="loadMoreIconFrames load--more--button" href="javascript:;"><span class="load--more-shadow"><span class="final--loader loadMoreLogosBoxes" style="display:none;"><img src="' + DH.getAssetImgUrl('logo-maker/loading.svg') + '" /></span>Load More</span></a></div>');
								if (p_fCallBack) {
									p_fCallBack();
								}
							} else {
								if (i === 1) {
									if ($('.load--more--class').length) {
										$('.load--more--class').remove();
									}
								}
								if (json.pagination == 0) {
									if (p_fCallBack) {
										p_fCallBack();
									}
								}
							}
							$('.finaLogoInner').html('');
						});
					}
				}
			});
		}
	}

	// logo lisiting by frames
	function logoByContainer(p_fCallBack) {
		debugConsole("logoByContainer");
		var limit = 10;
		var dataOption = $('.containerSection li.active a').data('frame');
		var currLogo = lEditor.currentLogo;
		debugConsole("dataOption:=" + dataOption);
		if (dataOption == 'none') {

			let oldLogoObj = getValidJsonParseObj(lEditor.getSession('currentLogo'));

			currLogo.frmId = "";
			currLogo.generate.framePath = "";
			currLogo.generate.templatePath.isFrame = 0;
			currLogo.generate.templatePath.frameType = "";
			currLogo.generate.templatePath.frameOverlap = "";
			currLogo.generate.templatePath.frame_width = "";
			currLogo.generate.templatePath.frame_height = "";
			currLogo.generate.templatePath.frameShapeName = "";
			currLogo.generate.templatePath.frmId = "";
			lEditor.getCurrentLogo();
			lEditor.setDefaultLogo(currLogo, currLogo.generate);

			var logoTemp = getValidJsonParseObj(lEditor.getSession('currentLogo'));
			var isIcon = 0;
			var isMono = 0;
			var isFrame = 0;
			var isIconFrame = 0;
			var isEqual = 0;
			var templateDirection = 0;
			if (typeof logoTemp.generate.templatePath.isIcon !== "undefined") {
				isIcon = logoTemp.generate.templatePath.isIcon;
			}
			if (typeof logoTemp.generate.templatePath.isMono !== "undefined") {
				isMono = logoTemp.generate.templatePath.isMono;
			}
			if (typeof logoTemp.generate.templatePath.isFrame !== "undefined") {
				isFrame = logoTemp.generate.templatePath.isFrame;
			}
			if (typeof logoTemp.generate.templatePath.isIconFrame !== "undefined") {
				isIconFrame = logoTemp.generate.templatePath.isIconFrame;
			}
			if (typeof logoTemp.generate.templatePath.isEqual !== "undefined") {
				isEqual = logoTemp.generate.templatePath.isEqual;

			}
			if (typeof logoTemp.generate.templatePath.template_direction !== "undefined") {
				templateDirection = logoTemp.generate.templatePath.template_direction;

			}
			var isFrameExist = logoTemp.generate.templatePath.isFrame;
			var isDBLineCompanyText = "no";
			if (logoTemp.generate.templatePath.isDBLineCompanyText == "yes") {
				isDBLineCompanyText = logoTemp.generate.templatePath.isDBLineCompanyText;
			}
			debugConsole("isFrameExist:=" + isFrameExist);
			var templates = getTemplatesByType(templateDirection, isIcon, isMono, isFrame, isIconFrame, isEqual, isDBLineCompanyText)[0];
			debugConsole("templates length:=" + templates.length);
			if (templates.length > 0) {
				$.each(templates, function (k, v) {
					logoTemp.generate.templatePath = v;
					logoTemp.generate.templatePath.frameType = currLogo.generate.templatePath.frameType;
					logoTemp.generate.templatePath.frameOverlap = currLogo.generate.templatePath.frameOverlap;
					if (isFrameExist == 1) {
						logoTemp.generate.templatePath.frame_width = currLogo.generate.templatePath.frame_width;
						logoTemp.generate.templatePath.frame_height = currLogo.generate.templatePath.frame_height;
						logoTemp.generate.templatePath.frameShapeName = currLogo.generate.templatePath.frameShapeName;
						logoTemp.generate.templatePath.frmId = currLogo.generate.templatePath.frmId;
					}
					logoTemp.generate.templatePath.sloganSetAsPerText = currLogo.generate.templatePath.sloganSetAsPerText;
					logoTemp.generate.templatePath.isDBLineCompanyText = currLogo.generate.templatePath.isDBLineCompanyText;
					var idKey = logoMakerFunction.genRandomId();
					logoTemp.generate.idKey = idKey;



					var returnObj = logoMakerFunction.generateLogoTemplate(logoTemp.generate, idKey, null, null, null, true, "outerContainerRemove");
					logoTemp.generate = returnObj.logoObj;

					$('.finaLogoInner').html('<div class="svg-slide--content svgSlideContent"><div class="water-mark-img"></div>' + returnObj.html + '<div class="bgOutlineBox bg-outline-box"></div></div>');
					currObj = updateCurrLogoObject(logoTemp);
					lEditor.setDefaultLogo(currObj, currObj.generate, function () {
						let newLogoObj = getValidJsonParseObj(lEditor.getSession('currentLogo'));
						editorUndoRedo.setUndoActData(OUTER_CONTAINER_REMOVE, oldLogoObj, newLogoObj);
					});
					$('#saveIcon').trigger('click');
				});
			} else {
				let newLogoObj = getValidJsonParseObj(lEditor.getSession('currentLogo'));
				editorUndoRedo.setUndoActData(OUTER_CONTAINER_REMOVE, oldLogoObj, newLogoObj);
				$('#saveIcon').trigger('click');
				debugConsole("i m coming");
			}

		}

		if (dataOption == 'whole') {
			var frameList = [];

			var i = 0;

			var type = 'frame';
			loadMoreStart++;

			if (loadMoreStart == 1) {
				lEditor.logoTempArr = [];
				lEditor.logoSlider('final', 1);
			}

			var j = (loadMoreStart - 1) * 10;

			jqXHR = $.ajax({
				url: DH.baseURL + '/logoMakerAjax.php',
				type: 'POST',
				data: { action: 'frames', 'type': $('.containerTypeList').val(), 'shape': $('.containerShapeList').val(), start: loadMoreStart },
				async: true,
				success: function (json) {
					$('.load--more--class').remove();
					json = getValidJsonParseObj(json);
					if (json.status == 0) {

					} else {
						var frameList = json.data.frames;
						var frameLength = frameList.length;
						if (frameLength == 0) {
							return false;
						}
						var templateIdStyle = getTempStyle();

						$.each(frameList, function (k, v) {
							var logoTemp = getValidJsonParseObj(lEditor.getSession('currentLogo'));
							logoTemp.frmId = v.frame_id;
							logoTemp.generate.templatePath.isFrame = 1;
							logoTemp.generate.framePath = v.frame_svg;
							logoTemp.generate.templatePath.frameType = v.frame_type;
							logoTemp.generate.templatePath.frameOverlap = v.frame_overlap;
							logoTemp.generate.templatePath.frame_width = v.frame_width;
							logoTemp.generate.templatePath.frame_height = v.frame_height;
							logoTemp.generate.templatePath.frmId = v.frame_id;
							logoTemp.generate.templatePath.lastTextDistance = 0;
							logoTemp.generate.templatePath.iconShiftDueToSloganDistance = 0;
							logoTemp.generate.templatePath.frameShapeName = $('.containerShapeList').val();
							debugConsole("logoTemp.generate.templatePath.sloganSetAsPerText:=" + logoTemp.generate.templatePath.sloganSetAsPerText);
							logoTemp.generate.templatePath.sloganSetAsPerText = logoTemp.generate.templatePath.sloganSetAsPerText;
							var idKey = logoMakerFunction.genRandomId();
							logoTemp.generate.idKey = idKey;
							var returnObj = logoMakerFunction.generateLogoTemplateByOption(logoTemp, type, idKey, null, null, "addOuterContainer");
							logoTemp.generate = returnObj.logoObj;
							currObj = updateCurrLogoObject(logoTemp);
							lEditor.logoTempArr[j] = getValidJsonParseObj(getValidJsonStringifyObj(currObj));

							var templateHint = showLogoAdminIds(logoTemp.generate.templatePath, logoTemp.sloganName, logoTemp.fId, logoTemp.cpId, logoTemp.sfId, logoTemp.frmId, logoTemp.iconFrameId, logoTemp.monofId);

							slickElement = '<div class="logos--boxes" data-frmid = "' + v.frame_id + '"><div class="item logo--slides logoSlides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="logoSlide-overlay gradient-div"><a href="javascript:;" class="icons-edit icons-update setDefaultLogo" data-type = "frame" data-id="' + (j++) + '"><span>Update to this</span></a></div><div class="svg--slide" style="background-color:' + logoTemp.generate.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + returnObj.html + '</div></div></div></div>';
							$(".finalogoSlider").append(slickElement);
							dh_utility_common.changeBg();
							i++;
							if (json.pagination == 1 && i == frameLength) {
								$(".finalogoSlider").append('<div class="load--more--class"><a class="loadMoreFrames load--more--button" href="javascript:;"><span class="load--more-shadow"><span class="final--loader loadMoreLogosBoxes" style="display:none;"><img src="' + DH.getAssetImgUrl('logo-maker/loading.svg') + '" /></span>Load More</span></a></div>');
								if (p_fCallBack) {
									p_fCallBack();
								}
							} else {
								if (json.pagination == 0) {
									if (p_fCallBack) {
										p_fCallBack();
									}
								}
							}
							$('.finaLogoInner').html('');
						});
					}
				}
			});
		}
	}

	// code for load more 
	$('body').on('click', '.loadMoreFrames', function () {
		debugConsole("loadMoreFrames click");
		$('.loadMoreLogosBoxes').css({ 'display': 'inline-block' });
		var scrollLastHeight = $('.step_7').find(".finalogoSlider").height();
		logoByContainer(function () {
			var scrollGap = $('.step_7').find(".finalogoSlider").height() - scrollLastHeight;
			$("html, body").animate({
				scrollTop: $('.step_7').find(".finalogoSlider").height() - scrollGap
			}, { duration: 'fast', easing: 'linear' });
		});

	});

	$('body').on('click', '.loadMoreIconFrames', function () {
		debugConsole("loadMoreIconFrames click");
		$('.loadMoreLogosBoxes').css({ 'display': 'inline-block' });
		var scrollLastHeight = $('.step_7').find(".finalogoSlider").height();
		logoByIconContainer(function () {
			var scrollGap = $('.step_7').find(".finalogoSlider").height() - scrollLastHeight;
			$("html, body").animate({
				scrollTop: $('.step_7').find(".finalogoSlider").height() - scrollGap
			}, { duration: 'fast', easing: 'linear' });
		});
	});


	$('body').on('click', '.loadMoreEditorIcons', function () {
		debugConsole("loadMoreEditorIcons click");
		$('.loadMoreLogosBoxes').css({ 'display': 'inline-block' });
		$('.loadMoreEditorIcons, .icons-search-box, .icons-search-box-button').css("pointer-events", "none");
		lEditor.objIconPage++;
		var scrollLastHeight = $('.step_7').find(".finalogoSlider").height();
		lEditor.ajaxEditIconsResponse(undefined, function () {
			debugConsole("ddddddddddddddddddnnnnnnnnneeeeeeee");
			var scrollGap = $('.step_7').find(".finalogoSlider").height() - scrollLastHeight;
			$("html, body").animate({
				scrollTop: $('.step_7').find(".finalogoSlider").height() - scrollGap
			}, { duration: 'fast', easing: 'linear' });
		});

	});


	$('body').on('click', '.loadMoreDynamicGenerate', function () {
		debugConsole("loadMoreDynamicGenerate click");
		$('.loadMoreLogosBoxes').css({ 'display': 'inline-block' });
		var scrollLastHeight = $('.step_7').find(".finalogoSlider").height();
		lEditor.generateDynamicLogoVariations(function () {
			debugConsole("doneeeeeeeeeeeeeeeeeeee:=");
			var scrollGap = $('.step_7').find(".finalogoSlider").height() - scrollLastHeight;
			$("html, body").animate({
				scrollTop: $('.step_7').find(".finalogoSlider").height() - scrollGap
			}, { duration: 'fast', easing: 'linear' });
		});
		// $("html, body").animate({
		// 	scrollTop: $('html').height()
		// }, { duration: 'fast', easing: 'linear' });
	});
	// 

	// logo listing by font families 
	function logoByfontFamily(parameters, p_fCallBack) {
		// debugConsole("logoByfontFamily parameters:=" + JSON.stringify(parameters));

		var workFor = null;
		if (lEditor.currentLogo.generate.templatePath.isDBLineCompanyText == "yes") {
			workFor = $('.subChild-8').find(".company-text-font-box").attr("last_selected");
		}

		debugConsole("workFor:=" + workFor);
		var limit = 10;
		var ele = parameters.obj;
		var $for = parameters.fors;
		var categoryId = ele.data('id');
		var letterSpacing = 0;
		var updateText = "";
		loadMoreStart++;

		debugConsole("categoryId:=" + categoryId);

		var templateIdStyle = getTempStyle();

		jqXHR = $.ajax({
			url: DH.baseURL + '/logoMakerAjax.php',
			type: 'POST',
			data: { action: 'fonts', category_id: categoryId, start: loadMoreStart },
			async: true,
			success: function (json) {
				json = getValidJsonParseObj(json);
				if (json.status == 0) {

				} else {
					var fontList = json.fonts;
					var logoTemp = getValidJsonParseObj(lEditor.getSession('currentLogo'));
					var type = "";
					var i = 0;
					var j = (loadMoreStart - 1) * limit;
					if (loadMoreStart == 1) {
						lEditor.logoTempArr = [];
						lEditor.logoSlider('final', 1);
					}
					var currentCompanyText = lEditor.currentLogo.logoName;
					var currentSloganText = lEditor.currentLogo.sloganName;

					var companyTextFS;
					var companyTextLS;

					var companyText1FS;
					var companyText1LS;

					var companyText2FS;
					var companyText2LS;

					var slgoanTextFS
					var slgoanTextLS;
					var logoTextList = lEditor.getLogoTextList(lEditor.currentLogo.generate.splitLogoName);
					debugConsole("logoTextList length:=" + logoTextList.length);

					if ($for == 'logo') {
						if (logoTemp.generate.templatePath.isDBLineCompanyText == "yes" && logoTextList.length > 0 && logoTextList.length == 2) {
							switch (workFor) {
								case "dd-ct-font-line1":
									companyText1FS = constantVars.ORIGINAL_SPACING.logoTextSlider;
									companyText1LS = parseFloat(constantVars.ORIGINAL_SPACING.logoLetterSpacing);
									break;
								case "dd-ct-font-line2":
									companyText2FS = constantVars.ORIGINAL_SPACING.logoTextSlider;
									companyText2LS = parseFloat(constantVars.ORIGINAL_SPACING.logoLetterSpacing);
									break;
								case "dd-ct-font-overall":
								default:
									companyText1FS = constantVars.ORIGINAL_SPACING.logoTextSlider;
									companyText1LS = parseFloat(constantVars.ORIGINAL_SPACING.logoLetterSpacing);
									companyText2FS = constantVars.ORIGINAL_SPACING.logoTextSlider;
									companyText2LS = parseFloat(constantVars.ORIGINAL_SPACING.logoLetterSpacing);
									break;
							}
						} else {
							companyTextFS = constantVars.ORIGINAL_SPACING.logoTextSlider;
							companyTextLS = parseFloat(constantVars.ORIGINAL_SPACING.logoLetterSpacing);
						}
					} else {
						slgoanTextFS = constantVars.ORIGINAL_SPACING.sloganTextSize;
						slgoanTextLS = parseFloat(constantVars.ORIGINAL_SPACING.sloganLetterSpacing);

					}

					var isEqualCaseSloganLetterSpacing = constantVars.ORIGINAL_SPACING.sloganLetterSpacing;
					if (logoMakerFunction.checkTemplateIsEqualCondition(logoTemp.generate) && logoTemp.generate.templatePath.sloganSetAsPerText == 1) {
						var logoNameLength;
						if (logoTemp.generate.templatePath.isDBLineCompanyText == "yes" && logoTextList.length > 0 && logoTextList.length == 2) {
							logoNameLength = Math.max(logoTextList[0].length, logoTextList[1].length)
						} else {
							logoNameLength = currentCompanyText.length;
						}
						var sloganNameLength = currentSloganText.length;
						debugConsole("logoNameLength:=" + logoNameLength);
						debugConsole("sloganNameLength:=" + sloganNameLength);
						if (logoNameLength >= sloganNameLength) {
							if (sloganNameLength >= 20) {
								isEqualCaseSloganLetterSpacing = (sloganNameLength + logoNameLength) / 2;
							} else {
								isEqualCaseSloganLetterSpacing = (sloganNameLength + logoNameLength);
							}
						} else if (sloganNameLength >= logoNameLength) {
							if (sloganNameLength / 2 < logoNameLength) {
								isEqualCaseSloganLetterSpacing = (sloganNameLength + logoNameLength);
							}
						}
						slgoanTextLS = isEqualCaseSloganLetterSpacing;
						debugConsole("slgoanTextLS:=" + slgoanTextLS);
					}


					var fontListLength = fontList.length;
					if (fontListLength == 0) {
						return false;
					}
					var whatChange = "";
					$.each(fontList, function (k, v) {
						opentype.load(v.font_link, function (err, font) {
							try {
								if (err) {
								} else {
									if ($for == 'logo') {
										var logo = null;
										if (logoTemp.generate.templatePath.isDBLineCompanyText == "yes" && logoTextList.length > 0 && logoTextList.length == 2) {

											switch (workFor) {
												case "dd-ct-font-line1":
													logo = font.getPath(logoTextList[0], 0, 0, companyText1FS, { 'letterSpacing': companyText1LS });
													logoTemp.generate.logoPath1 = logo.toSVG();
													logoTemp.generate.textFontType = v.font_link;
													type = "logoName1";
													break;
												case "dd-ct-font-line2":
													logo = font.getPath(logoTextList[1], 0, 0, companyText2FS, { 'letterSpacing': companyText2LS });
													logoTemp.generate.logoPath2 = logo.toSVG();
													logoTemp.generate.text2FontType = v.font_link;
													type = "logoName2";
													break;
												case "dd-ct-font-overall":
												default:
													debugConsole("companyText1FS:=" + companyText1FS)
													logo = font.getPath(logoTextList[0], 0, 0, companyText1FS, { 'letterSpacing': companyText1LS });
													logoTemp.generate.logoPath1 = logo.toSVG();
													logo = null;

													logo = font.getPath(logoTextList[1], 0, 0, companyText2FS, { 'letterSpacing': companyText2LS });
													logoTemp.generate.logoPath2 = logo.toSVG();

													logoTemp.generate.textFontType = v.font_link;
													logoTemp.generate.text2FontType = v.font_link;
													type = "logoName";
													break;
											}
										} else {
											logo = font.getPath(currentCompanyText, 0, 0, companyTextFS, { 'letterSpacing': companyTextLS });
											logoTemp.generate.logoPath = logo.toSVG();
											type = "logoName";
											logoTemp.generate.textFontType = v.font_link;
										}
										// debugConsole(" v.font_link:=" + v.font_link);
										if (v.font_id) {
											logoTemp.fId = v.font_id;
										}
										whatChange = "logoNameFont"
										// debugConsole("currSloganFontObject:=" + currSloganFontObject);
										// if (currSloganFontObject) {
										// 	logo = null;
										// 	logo = currSloganFontObject.getPath(currentSloganText, 0, 0, slgoanTextFS, { 'letterSpacing': slgoanTextLS });
										// 	logoTemp.generate.sloganPath = logo.toSVG();
										// }
									} else if ($for == "slogan") {
										var logo = null;
										// debugConsole("currCompFontObject:=" + currCompFontObject);
										// if (currCompFontObject) {
										// 	logo = currCompFontObject.getPath(currentCompanyText, 0, 0, companyTextFS, { 'letterSpacing': companyTextLS });
										// 	logoTemp.generate.logoPath = logo.toSVG();
										// }
										// logo = null;
										logo = font.getPath(currentSloganText, 0, 0, slgoanTextFS, { 'letterSpacing': slgoanTextLS });
										logoTemp.generate.sloganFontType = v.font_link;
										logoTemp.generate.sloganPath = logo.toSVG();
										type = "sloganName";
										if (v.font_id) {
											logoTemp.sfId = v.font_id;
										}
										whatChange = "sloganNameFont"
									}
									var idKey = logoMakerFunction.genRandomId();
									logoTemp.generate.idKey = idKey;
									debugConsole("logoTemp template_id:=" + logoTemp.generate.templatePath.template_id);
									debugConsole("logoTemp isEqual:=" + logoTemp.generate.templatePath.isEqual);
									debugConsole("logoTemp sloganSetAsPerText:=" + logoTemp.generate.templatePath.sloganSetAsPerText);
									var returnObj = logoMakerFunction.generateLogoTemplateByOption(logoTemp, type, idKey, null, null, whatChange);
									logoTemp.generate = returnObj.logoObj;


									// logoTemp.generate.logoTextSlider = companyTextFS;
									// logoTemp.generate.logoLetterSpacing = companyTextLS;

									// logoTemp.generate.sloganTextSize = slgoanTextFS;
									// logoTemp.generate.sloganLetterSpacing = slgoanTextLS;

									var templateHint = showLogoAdminIds(logoTemp.generate.templatePath, logoTemp.sloganName, logoTemp.fId, logoTemp.cpId, logoTemp.sfId, logoTemp.frmId, logoTemp.iconFrameId, logoTemp.monofId);

									currObj = updateCurrLogoObject(logoTemp);
									lEditor.logoTempArr[j] = getValidJsonParseObj(getValidJsonStringifyObj(currObj));
									slickElement = '<div class="logos--boxes" data-fntid = "' + v.font_id + '"><div class="logo--slides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="logoSlide-overlay  gradient-div"><a href="javascript:;" class="icons-edit icons-update setDefaultLogo" data-type="' + $for + '" data-id="' + (j++) + '"><span>Update to this</span></a></div><div class="svg--slide" style="background-color:' + currObj.generate.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + returnObj.html + '</div></div></div></div>';
									$(".finalogoSlider").append(slickElement);
									dh_utility_common.changeBg();
									i++;
									if (json.pagination == 1 && i == fontListLength) {
										if ($('.load--more--class').length) {
											$('.load--more--class').remove();
										}
										$(".finalogoSlider").append('<div class="load--more--class"><a class="loadMoreFonts load--more--button" href="javascript:;"><span class="load--more-shadow"><span class="final--loader loadMoreLogosBoxes" style="display:none;"><img src="' + DH.getAssetImgUrl('logo-maker/loading.svg') + '" /></span>Load More</span></a></div>');
										if (p_fCallBack) {
											p_fCallBack();
										}
									} else {
										if (i == 1) {
											if ($('.load--more--class').length) {
												$('.load--more--class').remove();
											}
										}
										if (json.pagination == 0) {
											if (p_fCallBack) {
												p_fCallBack();
											}
										}
									}
								}

							} catch (e) {
								//	alert(e);
							}
						});
					});

				}
			}
		});

	}

	// code for pagination 
	$('body').on('click', '.loadMoreFonts', function () {
		debugConsole("loadMoreFonts click");
		$('.loadMoreLogosBoxes').css({ 'display': 'inline-block' });
		var scrollLastHeight = $('.step_7').find(".finalogoSlider").height();
		logoByfontFamily(editorParameters, function () {
			var scrollGap = $('.step_7').find(".finalogoSlider").height() - scrollLastHeight;
			$("html, body").animate({
				scrollTop: $('.step_7').find(".finalogoSlider").height() - scrollGap
			}, { duration: 'fast', easing: 'linear' });
		});
	});

	$('body').on('click', '.loadMoreMonograms', function () {
		debugConsole("loadMoreMonograms click");
		$('.loadMoreLogosBoxes').css({ 'display': 'inline-block' });
		var scrollLastHeight = $('.step_7').find(".finalogoSlider").height();
		lEditor.getMonogramVariations("", function () {
			var scrollGap = $('.step_7').find(".finalogoSlider").height() - scrollLastHeight;
			$("html, body").animate({
				scrollTop: $('.step_7').find(".finalogoSlider").height() - scrollGap
			}, { duration: 'fast', easing: 'linear' });
		});
	});

	$('body').on('click', '.loadMoreVariations', function () {

		debugConsole("loadMoreVariations click");
		$('.loadMoreLogosBoxes').css({ 'display': 'inline-block' });
		loadMoreStart++;
		var scrollLastHeight = $('.step_7').find(".finalogoSlider").height();
		getLayoutVariations(function () {
			debugConsole("donnnnnnnnnnnnnnnee");
			var scrollGap = $('.step_7').find(".finalogoSlider").height() - scrollLastHeight;
			$("html, body").animate({
				scrollTop: $('.step_7').find(".finalogoSlider").height() - scrollGap
			}, { duration: 'fast', easing: 'linear' });
		});
		// $("html, body").animate({
		// 	scrollTop: $('html').height() - 400
		// }, { duration: 'fast', easing: 'linear' });
	});

	function loaderShow() {
		debugConsole("loaderShow");
		$('.editLogoSlider .loadMoreIcons').show();
		$('.finalogoSlider').hide();
	}

	function loaderHide() {
		debugConsole("loaderHide");
		$('.editLogoSlider .loadMoreIcons').hide();
		$('.finalogoSlider').show();
		$(".logoSlider").trigger('refresh.owl.carousel');
	}

	// disabling menu itesm
	function disableOption() {
		debugConsole("disableOption");
		var currentLogo = getValidJsonParseObj(lEditor.getSession('currentLogo'));
		var currLogo = currentLogo.generate;
		var targetlink = lEditor.getSession('targetlink');
		var defaultlink = lEditor.getSession('defaultlink');
		var logoname = lEditor.getSession('logoname');


		if (defaultlink == 7 || targetlink == 7) {
			if (logoname == '') {
				$('.companyName .companyFontCase, .companyName .rangeSlider, .iconVsTextSlider').addClass('disabled');
				$('.subMenu-8, .subMenu-13').parents('li').addClass('disabled');
			} else {
				$('.companyName .companyFontCase, .companyName .rangeSlider, .iconVsTextSlider').removeClass('disabled');
				$('.subMenu-8, .subMenu-13').parents('li').removeClass('disabled');
			}
		}

		eanbledSloganTool();

		if (currLogo.templatePath.isIcon != 1 && currLogo.templatePath.isMono != 1) {

			$('.iconDistanceSlider, .iconVsTextSlider, .logoSizeSlider').addClass('disabled');
			$('.subMenu-15').parents('li').addClass('disabled');
			$('.subMenu-15').text("Symbol");
		} else {
			$('.iconDistanceSlider, .iconVsTextSlider, .logoSizeSlider').removeClass('disabled');
			$('.subMenu-15').parents('li').removeClass('disabled');
			if (currLogo.templatePath.isIcon == 1) {
				$('.subMenu-15').text("Symbol");
			} else {
				$('.subMenu-15').text("Monogram");
			}

		}

		if (currLogo.templatePath.isIconFrame != 1) {
			$('.subMenu-43').parents('li').addClass('disabled');
		} else {
			$('.subMenu-43').parents('li').removeClass('disabled');
		}

		if (currLogo.framePath == '') {
			$('.frameSizeSlider').addClass('disabled');
			$('.subMenu-16').parents('li').addClass('disabled');
		} else {
			$('.frameSizeSlider').removeClass('disabled');
			$('.subMenu-16').parents('li').removeClass('disabled');
		}

	}
	function getTextTransform(p_sText, p_sType) {
		if (p_sText && p_sText !== "") {
			switch (p_sType) {
				case "caps":
					p_sText = toCapitalize(p_sText.toLowerCase());
					break;
				case "up":
					p_sText = p_sText.toUpperCase();
					break;
				case "low":
					p_sText = p_sText.toLowerCase();
					break;
			}
		}
		return p_sText;
	}
	/**
	 * 
	 * @param {*} p_sType 
	 * @param {*} p_sTextTransformCase 
	 * @param {*} p_nFontSize 
	 * @param {*} p_nLetterSpacing 
	 * @param {*} p_sActType 
	 * @param {*} p_sSliderType 
	 * @param {*} p_sLogoText 
	 */
	function updateLogoText(p_sType, p_sTextTransformCase, p_nFontSize, p_nLetterSpacing, p_sActType, p_sSliderType, p_sLogoText) {
		debugConsole("updateTextContent p_sType:=" + p_sType + ",,,p_sTextTransformCase:=" + p_sTextTransformCase + ",,p_nFontSize:=" + p_nFontSize + ",,,p_nLetterSpacing:=" + p_nLetterSpacing + ",,,p_sActType:=" + p_sActType + ",,,p_sSliderType:=" + p_sSliderType + ",,,p_sLogoText:=" + p_sLogoText);

		var logoTemp = lEditor.currentLogo;
		var updateLogoText;

		var updateSloganText = removeMultipleSpaces($(".editSloganName.templateText").val());
		debugConsole("updateSloganText:=" + updateSloganText);

		p_nFontSize = parseFloat(p_nFontSize);
		p_nLetterSpacing = parseFloat(p_nLetterSpacing);

		var changeLogoName = "";
		switch (p_sType) {
			case "logo":
			case "logoName":
				if (p_sActType == "slider" && ((p_sSliderType == "logoTextSlider") || (p_sSliderType == "logoLetterSpacing"))) {
					updateLogoText = lEditor.currentLogo.logoName;
				} else {
					updateLogoText = removeMultipleSpaces($(".editCompanyName.templateText").val());
					updateLogoText = getTextTransform(updateLogoText, p_sTextTransformCase);
					$(".editCompanyName.templateText").val(updateLogoText);
					lEditor.setSession('logoname', updateLogoText);
				}
				debugConsole("updateLogoText:=" + updateLogoText);
				break
			case "slogan":
			case "undo_redo_slogan":
				updateSloganText = getTextTransform(updateSloganText, p_sTextTransformCase);
				$(".editSloganName.templateText").val(updateSloganText);
				lEditor.setSession('sloganText', updateSloganText);
				break;
			case "logoName1":
				if (p_sActType == "slider" && ((p_sSliderType == "logoTextSlider") || (p_sSliderType == "logoLetterSpacing"))) {
					updateLogoText = lEditor.currentLogo.logoName1;
				}
				else if (p_sActType == "undo_redo_logoName1" && p_sLogoText) {
					updateLogoText = p_sLogoText;
				}
				else {
					updateLogoText = removeMultipleSpaces($(".dd-ct-line1.templateText").val());
					updateLogoText = getTextTransform(updateLogoText, p_sTextTransformCase);
					$(".dd-ct-line1.templateText").val(updateLogoText);
					changeLogoName = updateLogoText + " " + logoTemp.logoName2;
					lEditor.setSession('logoname', changeLogoName);
					$('.company-text-dd').text(changeLogoName);
					$(".editCompanyName.templateText").val(changeLogoName);
				}
				break;
			case "logoName2":
				if (p_sActType == "slider" && ((p_sSliderType == "logoTextSlider") || (p_sSliderType == "logoLetterSpacing"))) {
					updateLogoText = lEditor.currentLogo.logoName2;
				}
				else if (p_sActType == "undo_redo_logoName2" && p_sLogoText) {
					updateLogoText = p_sLogoText;
				}
				else {
					updateLogoText = removeMultipleSpaces($(".dd-ct-line2.templateText").val());
					updateLogoText = getTextTransform(updateLogoText, p_sTextTransformCase);
					$(".dd-ct-line2.templateText").val(updateLogoText);
					changeLogoName = logoTemp.logoName1 + " " + updateLogoText;
					lEditor.setSession('logoname', changeLogoName);
					$('.company-text-dd').text(changeLogoName);
					$(".editCompanyName.templateText").val(changeLogoName);
				}
				break;
		}
		disableOption();
		debugConsole(">>>>>>>>>>>>updateLogoText:=" + updateLogoText);

		var currLogo = getValidJsonParseObj(lEditor.getSession('currentLogo'));
		let oldLogoObj = getValidJsonParseObj(lEditor.getSession('currentLogo'));
		var lastUndoName = "";
		switch (p_sActType) {
			case "logoTextEdit":
				if (((p_sType == "logo") || (p_sType == "logoName"))) {
					lastUndoName = currLogo.logoName;
				}
				break;
			case "sloganTextEdit":
				if (p_sType == "slogan") {
					lastUndoName = currLogo.sloganName;
				}
				break;
			case "logoText1Edit":
				if (p_sType == "logoName1") {
					lastUndoName = currLogo.logoName1;
				}
				break;
			case "logoText2Edit":
				if (p_sType == "logoName2") {
					lastUndoName = currLogo.logoName2;
				}
				break;
		}

		var logo = null;
		var type;
		var splitLogoName = "";
		switch (p_sType) {
			case "logo":
			case "logoName":
				if (currCompFontObject) {
					var logoTextList = lEditor.getLogoTextList(updateLogoText);
					if ((currLogo.generate.templatePath.isDBLineCompanyText == "yes") && (p_sSliderType == "logoTextSlider") || (p_sSliderType == "logoLetterSpacing") && (currLogo.generate.splitLogoName)) {
						logoTextList = lEditor.getLogoTextList(currLogo.generate.splitLogoName);
					}
					debugConsole("logoTextList.length:=" + logoTextList.length + ",,,p_nFontSize:=" + p_nFontSize + ",,,p_nLetterSpacing:=" + p_nLetterSpacing);
					if ((currLogo.generate.templatePath.isDBLineCompanyText == "yes") && logoTextList.length > 0 && logoTextList.length == 2) {
						if (currLogo.generate.logoText1Slider) {
							logo = currCompFontObject.getPath(logoTextList[0], 0, 0, lEditor.currentLogo.generate.logoText1Slider, { 'letterSpacing': p_nLetterSpacing });
						} else {
							logo = currCompFontObject.getPath(logoTextList[0], 0, 0, p_nFontSize, { 'letterSpacing': p_nLetterSpacing });
						}
						logoTemp.generate.logoPath1 = logo.toSVG();
						logo = null;

						if (currLogo.generate.logoText2Slider) {
							logo = currCompFont2Object.getPath(logoTextList[1], 0, 0, currLogo.generate.logoText2Slider, { 'letterSpacing': p_nLetterSpacing });
						} else {
							logo = currCompFont2Object.getPath(logoTextList[1], 0, 0, p_nFontSize, { 'letterSpacing': p_nLetterSpacing });
						}

						logoTemp.generate.logoPath2 = logo.toSVG();

						splitLogoName = logoTextList[0] + "*" + logoTextList[1];
					} else {

						logo = currCompFontObject.getPath(updateLogoText, 0, 0, p_nFontSize, { 'letterSpacing': p_nLetterSpacing });
						logoTemp.generate.logoPath = logo.toSVG();
						if (logoTextList.length > 0 && logoTextList.length == 2) {
							splitLogoName = logoTextList[0] + "*" + logoTextList[1];
						} else {
							splitLogoName = "";
						}

					}
				}
				else {
					alert("logo text font not loaded");
				}
				currLogo.logoName = updateLogoText;
				type = "logoName";
				if (p_sActType != 'slider' && logoTemp.generate.templatePath.isIcon == 0 && p_sTextTransformCase == '') {
					var monotext = lEditor.getMonogramText(false);
					lEditor.setMonogramText(monotext);
					var monogramNew = currMonogramFontObject.getPath(monotext, 0, 0, constantVars.SPACING.monogramTextSize)
					logoTemp.generate.iconPath = monogramNew.toSVG();
					logoTemp.generate.monogram = monotext;
				}
				break
			case "slogan":
			case "undo_redo_slogan":
				if (currSloganFontObject) {
					logo = currSloganFontObject.getPath(updateSloganText, 0, 0, p_nFontSize, { 'letterSpacing': p_nLetterSpacing });
					logoTemp.generate.sloganPath = logo.toSVG();
					currLogo.sloganName = updateSloganText;
					type = "sloganName";
				} else {
					alert("slogan text font not loaded");
				}
				break;
			case "logoName1":
				if (currCompFontObject) {

					debugConsole("updateLogoText:=" + updateLogoText);
					debugConsole("p_nFontSize:=" + p_nFontSize);
					debugConsole("p_nLetterSpacing:=" + p_nLetterSpacing);

					logo = currCompFontObject.getPath(updateLogoText, 0, 0, p_nFontSize, { 'letterSpacing': p_nLetterSpacing });
					logoTemp.generate.logoPath1 = logo.toSVG();
				} else {
					alert("logoName1 text font not loaded");
				}
				currLogo.logoName1 = updateLogoText;
				currLogo.logoName = updateLogoText + " " + currLogo.logoName2;
				splitLogoName = updateLogoText + "*" + currLogo.logoName2;
				type = "logoName1";
				if (p_sActType == "undo_redo_logoName1" && p_sLogoText) {
					lEditor.setSession('logoname', currLogo.logoName);
					$('.company-text-dd').text(currLogo.logoName);
				}

				if (p_sActType != 'slider' && logoTemp.generate.templatePath.isIcon == 0 && p_sTextTransformCase == '') {
					var monotext = lEditor.getMonogramText(false);
					lEditor.setMonogramText(monotext);
					var monogramNew = currMonogramFontObject.getPath(monotext, 0, 0, constantVars.SPACING.monogramTextSize)
					logoTemp.generate.iconPath = monogramNew.toSVG();
					logoTemp.generate.monogram = monotext;
				}
				break;
			case "logoName2":
				if (currCompFont2Object) {
					debugConsole("updateLogoText:=" + updateLogoText);
					debugConsole("p_nFontSize:=" + p_nFontSize);
					debugConsole("p_nLetterSpacing:=" + p_nLetterSpacing);
					logo = currCompFont2Object.getPath(updateLogoText, 0, 0, p_nFontSize, { 'letterSpacing': p_nLetterSpacing });
					logoTemp.generate.logoPath2 = logo.toSVG();
				} else {
					alert("logoName2 text font not loaded");
				}
				currLogo.logoName2 = updateLogoText;
				currLogo.logoName = currLogo.logoName1 + " " + updateLogoText;
				splitLogoName = currLogo.logoName1 + "*" + updateLogoText;
				type = "logoName2";
				if (p_sActType == "undo_redo_logoName2" && p_sLogoText) {
					lEditor.setSession('logoname', currLogo.logoName);
					$('.company-text-dd').text(currLogo.logoName);
				}
				if (p_sActType != 'slider' && logoTemp.generate.templatePath.isIcon == 0 && p_sTextTransformCase == '') {
					var monotext = lEditor.getMonogramText(false);
					lEditor.setMonogramText(monotext);
					var monogramNew = currMonogramFontObject.getPath(monotext, 0, 0, constantVars.SPACING.monogramTextSize)
					logoTemp.generate.iconPath = monogramNew.toSVG();
					logoTemp.generate.monogram = monotext;
				}
				break;
		}

		var returnObj = logoMakerFunction.generateLogoTemplateByOption(logoTemp, type, logoTemp.generate.idKey, null, null, p_sActType);
		logoTemp = returnObj.logoObj;
		currLogo.generate = logoTemp;
		currLogo = updateCurrLogoObject(currLogo);
		$('.finaLogoInner').html('<div class="svg--slide" style="background-color:' + lEditor.currentLogo.generate.bgColor + ';"><div class="svg-slide--content svgSlideContent"><div class="water-mark-img"></div>' + logoMakerFunction.getFinalLogoTemplate(currLogo.generate) + '<div class="bgOutlineBox bg-outline-box"></div></div></div>');

		let newLogoObj = null;
		lEditor.setDefaultLogo(currLogo, currLogo.generate, function () {
			if (splitLogoName && splitLogoName != "") {
				currLogo.generate.splitLogoName = splitLogoName;
			}
			newLogoObj = getValidJsonParseObj(lEditor.getSession('currentLogo'));
			if (p_sTextTransformCase !== '') {

				switch (p_sType) {
					case "logo":
					case "logoName":
						editorUndoRedo.setUndoActData(LOGO_TEXT_TRANSFORM, oldLogoObj, newLogoObj);
						break;
					case "logoName1":
						editorUndoRedo.setUndoActData(LOGO_TEXT1_TRANSFORM, oldLogoObj, newLogoObj);
						break;
					case "logoName2":
						editorUndoRedo.setUndoActData(LOGO_TEXT2_TRANSFORM, oldLogoObj, newLogoObj);
						break;
					case "slogan":
						editorUndoRedo.setUndoActData(SLOGAN_TEXT_TRANSFORM, oldLogoObj, newLogoObj);
						break;
				}
			}

			switch (p_sActType) {
				case "logoTextEdit":
					if (((p_sType == "logo") || (p_sType == "logoName"))) {
						editorUndoRedo.setUndoActData(LOGO_TEXT_CHANGE, lastUndoName, removeMultipleSpaces($('.templateText.editCompanyName').val()));
					}
					break;
				case "sloganTextEdit":
					if (p_sType == "slogan") {
						editorUndoRedo.setUndoActData(SLOGAN_TEXT_CHANGE, lastUndoName, removeMultipleSpaces($('.templateText.editSloganName').val()));
					}
					break;
				case "logoText1Edit":
					if (p_sType == "logoName1") {
						editorUndoRedo.setUndoActData(LOGO_TEXT1_CHANGE, lastUndoName, updateLogoText);
					}
					break;
				case "logoText2Edit":
					if (p_sType == "logoName2") {
						editorUndoRedo.setUndoActData(LOGO_TEXT2_CHANGE, lastUndoName, updateLogoText);
					}
					break;
			}
			debugConsole("p_sSliderType:=" + p_sSliderType);
			switch (p_sSliderType) {
				case "logoTextSlider":
					editorUndoRedo.ltsNewLogoObj = null;
					editorUndoRedo.ltsNewLogoObj = newLogoObj;
					break;
				case "logoLetterSpacing":
					editorUndoRedo.llsNewLogoObj = null;
					editorUndoRedo.llsNewLogoObj = newLogoObj;
					break;
				case "sloganTextSize":
					editorUndoRedo.stsNewLogoObj = null;
					editorUndoRedo.stsNewLogoObj = newLogoObj;
					break;
				case "sloganLetterSpacing":
					editorUndoRedo.slsNewLogoObj = null;
					editorUndoRedo.slsNewLogoObj = newLogoObj;
					break;
				case "remove_slogan":
					newLogoObj = getValidJsonParseObj(lEditor.getSession('currentLogo'));
					editorUndoRedo.setUndoActData(SLOGAN_REMOVE, oldLogoObj, newLogoObj);
					break;
			}
		});
		if (p_sActType != "slider") {
			saveSliderData();
		}

	}
	function toCapitalize(p_sString) {
		let stringArray = p_sString.split(" ");
		for (let a = 0; a < stringArray.length; a++) {
			stringArray[a] = stringArray[a].charAt(0).toUpperCase() + stringArray[a].slice(1)
		}
		return stringArray.join(" ");
	}

	function checkStringCase(p_sString) {
		if (p_sString === p_sString.toUpperCase()) {
			return "up";
		}
		else if (p_sString === p_sString.toLowerCase()) {
			return "low";
		}
		else if (p_sString.charAt(0) === p_sString.charAt(0).toUpperCase()) {
			return "caps";
		}
		return "";
	}

	// listing by color gradients 
	function colorGradient(type) {
		debugConsole("colorGradient:=" + type);
		var workFor = null;
		if (lEditor.currentLogo.generate.templatePath.isDBLineCompanyText == "yes") {
			workFor = $('.subChild-13').find(".company-text-color-box").attr("last_selected");
		}
		debugConsole("workFor:=" + workFor);
		var targetLink = parseInt(lEditor.getSession('targetlink'));
		var colorDataType = lEditor.getSession('colorDataType');
		if (typeof colorDataType === 'undefined') {
			colorDataType = 'background';
		}
		var currLogo = lEditor.currentLogo;
		var oldLogoObj = getValidJsonParseObj(lEditor.getSession('currentLogo'));
		var color = '';
		var option;
		switch (colorDataType) {
			case 'foreground': {
				$('.colorSection .subnav li.active').each(function () {
					option = $(this).find('a').data('target');
					debugConsole("option:=" + option);
					switch (option) {
						case 13:
							switch (workFor) {
								case "dd-ct-color-line1":
									currLogo.generate.textGradient = type;
									break;
								case "dd-ct-color-line2":
									currLogo.generate.text2Gradient = type;
									break;
								case "dd-ct-color-overall":
								default:
									currLogo.generate.textGradient = type;
									if (currLogo.generate.templatePath.isDBLineCompanyText == "yes") {
										currLogo.generate.text2Gradient = type;
									}
									break;
							}
							break;

						case 14:
							currLogo.generate.sloganGradient = type;
							break;

						case 15:
							currLogo.generate.iconGradient = type;
							break;

						case 16:
							if (currLogo.generate.templatePath.frameType == "filled") {
								currLogo.generate.frameFilledGradient = type;
							} else {
								currLogo.generate.frameGradient = type;
							}
							break;

						case 43:
							editorUndoRedo.setUndoActData(EDIT_GRADIENT_COLORS_INNER_CONTAINER, currLogo.generate.iconFrameGradient, type);

							currLogo.generate.iconFrameGradient = type;
							break;

					}
				});
			}
		}
		lEditor.getCurrentLogo();
		// $('.editLogoSlider, .previewSection').addClass('hidden');
		$('.editLogoSlider').addClass('hidden');
		$('.editFinalLogo, .previewSection').removeClass('hidden');

		lEditor.setDefaultLogo(currLogo, currLogo.generate, function () {
			let newLogoObj = getValidJsonParseObj(lEditor.getSession('currentLogo'));
			switch (option) {
				case 13:
					var workFor;
					var parentDiv = $('.subChild-13').find(".company-text-color-box");
					workFor = parentDiv.attr("last_selected");
					switch (workFor) {
						case "dd-ct-color-line1":
							editorUndoRedo.setUndoActData(EDIT_GRADIENT_COLORS_LOGO_TEXT1, oldLogoObj, newLogoObj);
							break;
						case "dd-ct-color-line2":
							editorUndoRedo.setUndoActData(EDIT_GRADIENT_COLORS_LOGO_TEXT2, oldLogoObj, newLogoObj);
							break;
						case "dd-ct-color-overall":
						default:
							editorUndoRedo.setUndoActData(EDIT_GRADIENT_COLORS_LOGO_TEXT, oldLogoObj, newLogoObj);
							break;
					}
					break;
				case 14:
					editorUndoRedo.setUndoActData(EDIT_GRADIENT_COLORS_SLOGAN_TEXT, oldLogoObj, newLogoObj);
					break;
				case 15:
					editorUndoRedo.setUndoActData(EDIT_GRADIENT_COLORS_SYMBOL, oldLogoObj, newLogoObj);
					break;
				case 16:
					editorUndoRedo.setUndoActData(EDIT_GRADIENT_COLORS_OUTER_CONTAINER, oldLogoObj, newLogoObj);
					break;
				case 43:
					editorUndoRedo.setUndoActData(EDIT_GRADIENT_COLORS_INNER_CONTAINER, oldLogoObj, newLogoObj);
					break;
			}
		});
		lEditor.previewColors();
		lEditor.previewLogo();
		$('#saveIcon').trigger('click');
	}


	// update item size by center 
	function updateSizeByCenter(object, template, type, size, direction) {
		var dimension = template[type];
		var x = dimension.x;
		var y = dimension.y;
		var oscale = dimension.scale;
		var ratio = oscale / x;
		var scale = 1;

		scale += (size / 100);
		var bbox = object.get(0).getBBox();

		bbox.width = parseFloat(bbox.width);
		bbox.height = parseFloat(bbox.height);
		bbox.x = parseFloat(bbox.x);
		bbox.y = parseFloat(bbox.y);

		var svgWidth = parseFloat(constantVars.SVGWIDTH);
		var svgHeight = parseFloat(constantVars.SVGHEIGHT);
		if (direction == 'right') {
			x = x - size; // ratio;
			y = y - size;
		} else {
			x = x + size; // ratio;
			y = y + size;
		}


		object.attr('transform', "scale(" + scale + ") translate(" + x + "," + y + ")");
		obj = { 'x': x, 'y': y, 'scale': scale };
		return obj;
	}

	function updateGroupSizeByLastValue(object, p_oObj) {
		var x = p_oObj.x
		var y = p_oObj.y
		var scale = p_oObj.scale;
		object.attr('transform', "scale(" + scale + ") translate(" + x + "," + y + ")");
		var obj1 = { 'x': x, 'y': y, 'scale': scale };
		return obj1;
	}

	// update item zise of SVG ( any ) 
	function updateGroupSize(object, template, type, size) {

		var dimension = template[type];
		debugConsole("dimension:=" + dimension);
		debugConsole("updateGroupSize:=" + type + ":=" + dimension.field);
		var scale = 1;
		if (type == "frame" && template.isFrame == 0) {
			object.attr('transform', "scale(0) translate(0,0)");
			return { 'x': 0, 'y': 0, 'scale': 0 };
		}

		var bbox = object.get(0).getBBox();
		var x = 0;
		var y = 0;

		var ox = dimension.x;
		var oy = dimension.y;
		var oscale = dimension.scale;

		var obj = {};
		scale = scale + (size / 100);
		if ((type === "slogan" || type === "text" || type === "text1" || type === "text2") && (size != 0)) {
			scale = size;
			debugConsole(type + " scaling " + scale + " is now setting from size parameters because of isEqual = 1");
		}

		if (dimension.field == "logoContainer") {
			if (type === "logoContainer") {
				debugConsole("logoContainer width:=" + (bbox.width) + ",,," + (bbox.height));
			}
			if (template.isFrame == 1) {
				scale = 1;
			} else {

				if (bbox.width >= bbox.height) {
					if (bbox.width >= constantVars.SVGWIDTH) {
						scale = constantVars.SVGWIDTH / bbox.width;
						scale = scale - 0.1;
					} else {
						scale = 0.99;
					}
				} else {
					if (bbox.height >= constantVars.SVGHEIGHT) {
						scale = constantVars.SVGHEIGHT / bbox.height;
						scale = scale - 0.1;
					} else {
						scale = 0.99;
					}
				}
			}
		}

		if (dimension.field == "frame") {
			if (template.isFrame == 0) {
				object.attr('transform', "scale(0) translate(0,0)");
				return { 'x': 0, 'y': 0, 'scale': 0 };
			}
		}

		if (type === "iconFrameBox" && template.isIconFrame == 1 && (template.isIcon == 1 || template.isMono == 1) && size != 0) {
			scale = size;
		}
		//--------------------new----------------------
		if (dimension.field == "containerBody") {
			debugConsole("template.isFrame:=" + template.isFrame + ",,,," + template.frameOverlap);

			if (template.isFrame == 1 && (template.frameOverlap == 0 || template.frameOverlap == undefined)) {
				if (template.frame_width && parseInt(template.frame_width) != 0 && template.frame_width != "" && template.frame_height && parseInt(template.frame_height) != 0 && template.frame_height != "") {

					scale = setContentInFrame(template, bbox);
					// var frame = $('#templateGenerator .container_1').get(0).getBBox();
					// scale = setScaleNew(template, frame.width, frame.height, bbox.width, bbox.height);
					debugConsole("set scaling from database frame height and width");
				} else {
					var frame = $('#templateGenerator .container_1').get(0).getBBox();
					// var frameHeight = (frame.height / 2) > constantVars.FRAMERATIO ? frame.height / 2 : constantVars.FRAMERATIO;
					// var frameWidth = (frame.width / 2) > constantVars.FRAMERATIO ? frame.width / 2 : constantVars.FRAMERATIO;
					var frameHeight;
					var frameWidth;
					if (lEditor.currentLogo.generate && lEditor.currentLogo.generate.templatePath.frameShapeName && lEditor.currentLogo.generate.templatePath.frameShapeName == "brush") {
						frameHeight = (frame.height / 2) > constantVars.FRAMERATIO ? frame.height / 2 : constantVars.FRAMERATIO;
						frameWidth = (frame.width / 2) > constantVars.FRAMERATIO ? frame.width / 2 : constantVars.FRAMERATIO;
					} else {
						frameHeight = (frame.height / 2) > constantVars.FRAMERATIO ? constantVars.FRAMERATIO : frame.height / 2;
						frameWidth = (frame.width / 2) > constantVars.FRAMERATIO ? constantVars.FRAMERATIO : frame.width / 2;
					}
					scale = setScale(frameWidth, bbox.width, frameHeight, bbox.height);
					debugConsole("set scaling for old logo's");
					//-----------------------------
				}
			} else {
				var container = $('#templateGenerator .containerBody').get(0).getBBox();
				var containerWidth = container.width;
				var containerHeight = container.height;
				// scale = setScale(460, containerWidth, 460, containerHeight) + 0.12;
				scale = setScale(400, containerWidth, 400, containerHeight) + 0.12;
			}
		}
		//--------------------------------------------
		if (dimension.field == "icon") {
			if (template.isIconFrame == 1 && (template.isIcon == 1 || template.isMono == 1)) {
				scale = 100 / (bbox.width);
				if (scale > (100 / bbox.height)) {
					scale = 100 / bbox.height;
				}
				debugConsole("icon scale from iconFrame:=" + scale);
			} else {
				// scale = 100 / (bbox.width);
				// if (scale > (100 / bbox.height)) {
				// 	scale = 100 / bbox.height;
				// }
				//setting using updateCurrentIconSize
				debugConsole("icon scale from 100:=" + scale);
			}
		}
		// debugConsole("dimension.xType:=" + dimension.xType);
		if (dimension.xType == 'left') {
			x = (constantVars.SVGWIDTH * dimension.widthStart / 100) / scale - bbox.x * scale;
		}
		if (dimension.xType == 'center') {
			x = ((constantVars.SVGWIDTH * dimension.widthPercent / 100) + (constantVars.SVGWIDTH * dimension.widthStart / 100)) / (2 * scale) - ((bbox.width) / 2) - bbox.x;
		}
		if (dimension.xType == 'right') {
			x = (constantVars.SVGWIDTH * dimension.widthStart / 100) + (constantVars.SVGWIDTH * dimension.widthPercent / 100) / scale - bbox.width - bbox.x;
		}

		if (dimension.yType == 'up') {
			y = ((constantVars.SVGHEIGHT * dimension.heightStart / 100)) / scale - bbox.y;
		}
		if (dimension.yType == 'center') {
			y = (constantVars.SVGHEIGHT * dimension.heightStart / 100 + constantVars.SVGHEIGHT * dimension.heightPercent / 100) / (2 * scale) - bbox.height / 2 - bbox.y;
		}
		if (dimension.yType == 'down') {
			y = ((constantVars.SVGHEIGHT * dimension.heightStart / 100) + (constantVars.SVGHEIGHT * dimension.heightPercent / 100)) / scale - (bbox.height) - bbox.y;

			if (type === "text1" && (template.text1) && (template.text2) && (template.isDBLineCompanyText == "yes") && (object.length)) {
				// var ob1 = $('#templateGenerator  .svgLogoName_1');
				// var ob2 = $('#templateGenerator  .svgLogoName_2');
				var ob1 = object;
				var ob2 = object.siblings(".svgLogoName_2");
				if (ob2 && ob1) {
					var bbox1 = ob1.get(0).getBBox();
					var bbox2 = ob2.get(0).getBBox();
					var b1h = bbox1.height;
					var b2h = bbox2.height;
					var gaps = 0;
					if (b1h > b2h) {
						gaps = (b1h - b2h);
					}
					else if (b2h > b1h) {
						gaps = (b2h - b1h);
					}
					gaps = 20;
					y = ((constantVars.SVGHEIGHT * dimension.heightStart / 100) + (constantVars.SVGHEIGHT * dimension.heightPercent / 100)) / scale - (bbox.height + b2h) - (bbox.y) - gaps;
				}
			}
		}

		debugConsole("template.lastTextDistance:=" + template.lastTextDistance);
		if ((template.lastTextDistance) != undefined) {
			if (parseInt(template.lastTextDistance) > 0) {
				switch (type) {
					case "slogan":
						y = y + parseInt(template.lastTextDistance);
						break;
					case "textAndSlogan":
						// y = y + parseInt(template.lastTextDistance) / 2;
						y = y + parseInt(template.lastTextDistance);
						break;
				}
			}
		}
		debugConsole("template.lastSymbolXDistance:=" + template.lastSymbolXDistance);
		if (template.lastSymbolXDistance != undefined && type == "textAndSlogan") {
			if (parseInt(template.lastSymbolXDistance) > 0) {
				switch (template.tempType) {
					case "left":
						x = x + parseInt(template.lastSymbolXDistance);
						break;
					case "right":
						x = x - parseInt(template.lastSymbolXDistance);
						break;
				}
			}
		}
		if (x < constantVars.MINX || x > constantVars.MAXX) {
			obj = { 'x': ox, 'y': oy, 'scale': oscale };
		}
		object.attr('transform', "scale(" + scale + ") translate(" + x + "," + y + ")");
		obj = { 'x': x, 'y': y, 'scale': scale, 'height': bbox.height };
		return obj;
	}
	/**
	 * 
	 * @param {*} template 
	 * @param {*} bbox 
	 */
	function setContentInFrame(template, bbox) {
		debugConsole("setContentInFrame");
		var frameDimension;
		var scale = 0;
		var isBool1 = false;
		debugConsole("template.direction:=" + template.template_direction);
		debugConsole("template.isMono:=" + template.isMono);
		debugConsole("template.isIcon:=" + template.isIcon);
		debugConsole("template.frame_width:=" + template.frame_width);
		debugConsole("template.frame_height:=" + template.frame_height);
		debugConsole("template.frmId:=" + template.frmId);
		debugConsole("bbox.width:=" + bbox.width);
		debugConsole("bbox.height:=" + bbox.height);
		if (template.isMono == 0 && template.isIcon == 0 && (template.isDBLineCompanyText != "yes")) {
			scale = setScale(parseInt(template.frame_width), bbox.width, parseInt(template.frame_height), bbox.height);
		} else {
			var logoText = lEditor.getSession('logoname');
			debugConsole("logoText.length:=" + logoText.length);
			debugConsole("template.frameShapeName:=" + template.frameShapeName);
			if ((template.template_direction == 1 || template.template_direction == 2)) {
				// width case
				frameDimension = parseInt(template.frame_width);
				switch (template.frameShapeName.toLowerCase()) {
					case "rectangle":
						if (template.frmId == 289) {
							if ((logoText.length > 18)) {
								frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height);
								frameDimension = frameDimension - 50;
							}
						}
						if (template.frmId == 133) {
							if ((logoText.length > 18)) {
								frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height) / 2;
								frameDimension = frameDimension - 30;
							}
						}
						if (template.frmId == 330) {
							if ((logoText.length > 18)) {
								frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height) / 2;
								frameDimension = frameDimension - 80;
							}
						}
						if (template.frmId == 363 || template.frmId == 364) {
							if ((logoText.length > 18)) {
								frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height) / 2;
								frameDimension = frameDimension - 50;
							}
						}
						if (template.frmId == 269) {
							if ((logoText.length > 18)) {
								frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height) / 2;
								frameDimension = frameDimension - 50;
							}
						}
						if (template.frmId == 154 || template.frmId == 253) {
							if ((logoText.length > 18)) {
								frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height) / 2;
								frameDimension = frameDimension - 80;
							}
						}

						else if (template.frmId == 127 || template.frmId == 129 || template.frmId == 122) {
							frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height);
						}
						break;

					case "hexagon":
						if (template.frmId == 3) {
							if ((logoText.length > 14)) {
								frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height) / 2;
								frameDimension = frameDimension - 30;
							}
						}
						if (template.frmId == 125) {
							if ((logoText.length > 10)) {
								frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height);
								frameDimension = frameDimension - 80;
							}
						}
						break;
					case "octagon":
						if (template.frmId == 156) {
							if ((logoText.length > 18)) {
								frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height) / 2;
								frameDimension = frameDimension - 30;
							}
						}
						if (template.frmId == 256) {
							if ((logoText.length > 18)) {
								frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height) / 2;
								frameDimension = frameDimension - 80;
							}
						}
						if (template.frmId == 258) {
							if ((logoText.length > 18)) {
								frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height) / 2;
								frameDimension = frameDimension - 50;
							}
						}
						break;
					case "ellipse":
						frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height);
						frameDimension = frameDimension - 30;
						break;
					case "square":

						break;
				}
			} else {
				// dir 0 and 4
				// height case
				frameDimension = parseInt(template.frame_height);
				if ((logoText.length > 18)) {
					frameDimension = parseInt(template.frame_width);
				}
				if (template.frmId == 269) {
					if ((logoText.length > 18)) {
						frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height) / 2;
						frameDimension = frameDimension - 50;
					}
				}
				if (template.frmId == 3) {
					if ((logoText.length > 18)) {
						frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height) / 2;
						frameDimension = frameDimension - 50;
					}
				}
				// if (template.frmId == 125) {
				// 	if ((logoText.length >= 10)) {
				// 		frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height) / 2;
				// 		frameDimension = frameDimension - 80;
				// 	}

				// }
				if (template.frmId == 156) {
					if ((logoText.length > 18)) {
						frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height) / 2;
						frameDimension = frameDimension - 50;
					}
				}
				if (template.frmId == 256) {
					if ((logoText.length > 18)) {
						frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height) / 2;
						frameDimension = frameDimension - 80;
					}
				}
				if (template.frmId == 258) {
					if ((logoText.length > 18)) {
						frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height) / 2;
						frameDimension = frameDimension - 70;
					}
				}
				switch (template.frameShapeName.toLowerCase()) {
					case "rectangle":
						if (template.frmId == 127 || template.frmId == 129 || template.frmId == 122) {
							frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height);
							isBool1 = true;
						}
						break;
					case "ellipse":
						if ((logoText.length >= 28)) {
							frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height);
							frameDimension = frameDimension - 20;
						} else {
							frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height) / 2;
							frameDimension = frameDimension - 20;
						}
						break;
				}
			}
			debugConsole("frameDimension:=" + frameDimension);
			if (bbox.width > bbox.height) {
				if (frameDimension > bbox.width) {
					scale = bbox.width / frameDimension;
				} else {
					scale = frameDimension / bbox.width;
				}
			} else {
				if (frameDimension > bbox.height) {
					scale = bbox.height / frameDimension;
				} else {
					scale = frameDimension / bbox.height;
				}
			}
			debugConsole("scale:=" + scale);
			debugConsole("isBool1:=" + isBool1);
			if (template.frameShapeName.toLowerCase() == "circle") {

			} else {
				if ((scale * bbox.height) > template.frame_height) {
					scale = template.frame_height / bbox.height;
					debugConsole("after scale height:=" + scale);
				}
			}
		}
		debugConsole("------------------------------");
		return scale;
	}
	function setScaleNew(template, p_nFrameWidth, p_nFrameHeight, p_nContentWidth, p_nContentHeight) {
		var scale = 0;

		debugConsole("setScaleNew:=" + p_nFrameWidth + ",," + p_nFrameHeight + ",," + p_nContentWidth + ",," + p_nContentHeight);
		debugConsole("template.frmId:=" + template.frmId);
		var gap = 0;


		if (template.frameShapeName.toLowerCase() == "circle") {
			gap = Math.max(p_nFrameWidth, p_nFrameHeight) / 4;
		} else {
			if (p_nFrameWidth >= p_nFrameHeight) {
				gap = (p_nFrameWidth - p_nFrameHeight) / 2;
			} else {
				gap = (p_nFrameHeight - p_nFrameWidth) / 2;
			}
		}
		gap = 0;
		// gap = 100;
		debugConsole("gap:=" + gap);
		if (p_nContentWidth > p_nContentHeight) {

			if ((p_nFrameWidth) > p_nContentWidth) {
				debugConsole("scaling set via width1111");
				// gap = p_nContentHeight;
				scale = (p_nContentWidth) / (p_nFrameWidth + gap);
			} else {
				// gap = p_nContentHeight;
				debugConsole("scaling set via width22222");
				scale = (p_nFrameWidth - gap) / (p_nContentWidth);
			}

			var ab = scale * p_nContentHeight;
			if (ab <= p_nFrameHeight) {
				// sahi hai scaling 
				debugConsole("scaling sahi hai width ki");
			} else {
				debugConsole("scaling set via height if width ki sahi nhi hai");
				if (p_nFrameHeight > p_nContentHeight) {
					scale = p_nContentHeight / (p_nFrameHeight + gap);
				} else {
					scale = (p_nFrameHeight) / (p_nContentHeight + gap);
				}
			}
			debugConsole("gap:=" + gap);
		} else {

			if (p_nFrameHeight > p_nContentHeight) {
				debugConsole("scaling set via height1111111111");
				// gap = p_nContentWidth;
				scale = p_nContentHeight / (p_nFrameHeight);
			} else {
				debugConsole("scaling set via height22222222");
				// gap = p_nContentWidth;
				scale = (p_nFrameHeight) / (p_nContentHeight + gap);
			}
			var ab = scale * p_nContentWidth;
			if (ab <= p_nFrameWidth) {
				// sahi hai scaling 
				debugConsole("scaling sahi hai height ki");
			} else {
				debugConsole("scaling set via width if height ki sahi nhi hai");
				if (p_nFrameWidth > p_nContentWidth) {
					scale = (p_nContentWidth) / (p_nFrameWidth + gap);
				} else {
					scale = (p_nFrameWidth) / (p_nContentWidth + gap);
				}
			}

		}
		debugConsole("scale:=" + scale);
		return scale;
	}
	// update current logo ojgect ( template to main )  
	function updateCurrentLogoSize(object, dimension, size, type) {
		if (type == "frame" && dimension.isFrame == 0) {
			object.attr('transform', "scale(0) translate(0,0)");
			return { 'x': 0, 'y': 0, 'scale': 0 };
		}
		var scale = 1;
		var bbox = object.get(0).getBBox();
		var x = dimension[type].x;
		var y = dimension[type].y
		var obj = {};

		scale = scale + (size / 100);

		if (dimension[type].field == "logoContainer") {
			scale = setScale(constantVars.SVGHWIDTH, bbox.width, constantVars.SVGHEIGHT, bbox.height);
		}
		if (dimension[type].field == "containerBody") {
			scale = setScale(constantVars.FRAMERATIO, bbox.width, constantVars.FRAMERATIO, bbox.height);
			object.attr('transform', "scale(" + scale + ")");
		}
		if (dimension.field == "icon") {
			scale = 100 / bbox.width;
			if (scale > 100 / bbox.height) {
				scale = 100 / bbox.height;
			}
		}

		scale = scale + (size / 100);
		if (dimension.xType == 'left') {
			x = (constantVars.SVGWIDTH * dimension.widthStart / 100) / scale - bbox.x * scale;
		}
		if (dimension.xType == 'center') {
			x = ((constantVars.SVGWIDTH * dimension.widthPercent / 100) + (constantVars.SVGWIDTH * dimension.widthStart / 100)) / (2 * scale) - ((bbox.width) / 2) - bbox.x;
		}
		if (dimension.xType == 'right') {
			x = (constantVars.SVGWIDTH * dimension.widthStart / 100) + (constantVars.SVGWIDTH * dimension.widthPercent / 100) / scale - bbox.width - bbox.x;
		}

		if (dimension.field == "slogan") {
			bboxText = $('#templateGenerator  .svgLogoName_1').get(0).getBBox();
			y = template.updates.text.y + bboxText.height / 2 + 10;
		} else {
			if (dimension.yType == 'up') {
				y = ((constantVars.SVGHEIGHT * dimension.heightStart / 100)) / scale - bbox.y;
			}
			if (dimension.yType == 'center') {
				y = (constantVars.SVGHEIGHT * dimension.heightStart / 100 + constantVars.SVGHEIGHT * dimension.heightPercent / 100) / (2 * scale) - bbox.height / 2 - bbox.y;
			}
			if (dimension.yType == 'down') {
				y = ((constantVars.SVGHEIGHT * dimension.heightStart / 100) + (constantVars.SVGHEIGHT * dimension.heightPercent / 100)) / scale - (bbox.height) - bbox.y;
			}
		}
		object.attr('transform', "scale(" + scale + ") translate(" + x + "," + y + ")");
		obj = { 'x': x, 'y': y, 'scale': scale };
		return obj;
	}

	// ( updateing frame size ) 
	function updateFrameSize(object, size) {
		var scale = 1;
		scale += (size / 100);
		var bbox = object.get(0).getBBox();
		bbox.width = parseFloat(bbox.width);
		bbox.height = parseFloat(bbox.height);
		bbox.x = parseFloat(bbox.x);
		bbox.y = parseFloat(bbox.y);
		var svgWidth = parseFloat(constantVars.SVGWIDTH);
		var svgHeight = parseFloat(constantVars.SVGHEIGHT);
		var x = svgWidth / (2 * scale) - ((bbox.width) / 2) - bbox.x;
		if (x < 0 || x > svgWidth) return;
		var y = (svgHeight / (2 * scale)) - ((bbox.height) / 2) - bbox.y;
		if (y < 0 || y > svgHeight) return;
		object.attr('transform', "scale(" + scale + ") translate(" + x + "," + y + ")");
		obj = { 'x': x, 'y': y, 'scale': scale };
		return obj;
	}

	// not in use
	function updateIconVsText(obj1, obj2, size) {
		updateGroupSize(obj1, size * (-1));
		updateGroupSize(obj2, size);
	}

	// not in use
	function updateBetweenDistance(obj1, obj2, distance) {
		var obj1Scale = obj1.data('scale');
		var obj1X = obj1.data('x');
		var obj1Y = obj1.data('y');
		var obj2Scale = obj2.data('scale');
		var obj2X = obj2.data('x');
		var obj2Y = obj2.data('y');

		obj1Y = obj1Y - (distance);
		obj2Y = obj2Y + (distance);

		obj1.attr('transform', "scale(" + obj1Scale + ") translate(" + obj1X + "," + obj1Y + ")");
		obj1.data('x', obj1X);
		obj1.data('y', obj1Y);
		obj2.attr('transform', "scale(" + obj2Scale + ") translate(" + obj2X + "," + obj2Y + ")");
		obj2.data('x', obj2X);
		obj2.data('y', obj2Y);
	}

	// listing by color variation 
	function fixedColorVariation(editorParameters, p_fCallBack) {
		debugConsole("fixedColorVariation:=");
		var workFor = null;
		if (lEditor.currentLogo.generate.templatePath.isDBLineCompanyText == "yes") {
			workFor = $('.subChild-13').find(".company-text-color-box").attr("last_selected");
		}
		var colorId = editorParameters.id;
		var colorVal = editorParameters.color;
		var dataOption = colorVal;
		loadMoreStart++;
		var limit = 10;
		var templateIdStyle = getTempStyle();
		jqXHR = $.ajax({
			url: DH.baseURL + '/logoMakerAjax.php',
			type: 'POST',
			data: { action: 'colors', color_id: colorId, start: loadMoreStart },
			async: true,
			success: function (json) {
				json = getValidJsonParseObj(json);
				if (json.status == 0) {

				} else {
					var colorVariant = json.colors;
					var targetLink = parseInt(lEditor.getSession('targetlink'));
					var colorDataType = lEditor.getSession('colorDataType');
					if (typeof colorDataType === 'undefined') {
						colorDataType = 'background';
					}
					var logoTemp = getValidJsonParseObj(lEditor.getSession('currentLogo'));
					var i = 0;
					var k = (loadMoreStart - 1) * limit;
					var type = '';

					if (loadMoreStart == 1) {
						lEditor.logoTempArr = [];
						lEditor.logoSlider('final', 1);
					}
					var color = '';
					var colorVariantLength = colorVariant.length;
					// $('.load--more--class').remove();
					if (colorVariantLength == 0) {
						return false;
					}

					var returnObj = {};
					$('.editFinalLogo').addClass('hidden');
					$('.editLogoSlider').removeClass('hidden');
					$.each(colorVariant, function (kee, v) {
						var idKey = logoMakerFunction.genRandomId();
						logoTemp.generate.idKey = idKey;
						switch (colorDataType) {
							case 'background': {
								color = "" + v.cp_code;
								logoTemp.generate.bgColor = color;
								constantVars.colors.bgColorFamily = dataOption;
								returnObj = logoMakerFunction.generateLogoTemplateByOption(logoTemp, type, idKey);
								break;
							}
							case 'foreground': {
								var j = 0;
								$('.colorSection .subnav li.active').each(function () {
									color = "" + v.cp_code;
									var option = $(this).find('a').data('target');
									switch (option) {
										case 13: {

											switch (workFor) {
												case "dd-ct-color-line1":
													logoTemp.generate.mainTextColor = color;
													logoTemp.generate.textGradient = "";
													break;
												case "dd-ct-color-line2":
													logoTemp.generate.mainText2Color = color;
													logoTemp.generate.text2Gradient = "";
													break;
												case "dd-ct-color-overall":
												default:
													logoTemp.generate.mainTextColor = color;
													logoTemp.generate.mainText2Color = color;
													logoTemp.generate.textGradient = "";
													logoTemp.generate.text2Gradient = "";
													break;
											}
											constantVars.colors.mainTextFamily = dataOption;
											break;
										}
										case 14: {
											logoTemp.generate.sloganTextColor = color;
											logoTemp.generate.sloganGradient = "";
											constantVars.colors.sloganTextFamily = dataOption;
											break;
										}
										case 15: {
											logoTemp.generate.iconColor = color;
											logoTemp.generate.iconGradient = "";
											constantVars.colors.iconFamily = dataOption;
											break;
										}
										case 16: {
											if (logoTemp.generate.templatePath.frameType == "filled") {
												logoTemp.generate.frameFilledColor = color;
												logoTemp.generate.frameGradient = "";
											} else {
												logoTemp.generate.frameColor = color;
												logoTemp.generate.frameGradient = "";
											}
											constantVars.colors.frameFamily = dataOption;
											break;
										}
										case 43: {
											logoTemp.generate.iconFrameColor = color;
											logoTemp.generate.iconFrameGradient = "";
											constantVars.colors.iconFrameFamily = dataOption;
											break;
										}
									}

									returnObj = logoMakerFunction.generateLogoTemplateByOption(logoTemp, type, idKey);
									j++;
								});
							}
						}
						logoTemp.generate = returnObj.logoObj;
						lEditor.logoTempArr[k] = getValidJsonParseObj(getValidJsonStringifyObj(logoTemp));

						templateHint = showLogoAdminIds(logoTemp.generate.templatePath, logoTemp.sloganName, logoTemp.fId, logoTemp.cpId, logoTemp.sfId, logoTemp.frmId, logoTemp.iconFrameId, logoTemp.monofId);

						slickElement = '<div class="logos--boxes" data-cpId = "' + v.cp_id + '"><div class="item logo--slides logoSlides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="logoSlide-overlay gradient-div"><a href="javascript:;" class="icons-edit icons-update setDefaultLogo" data-type="color" data-id="' + (k++) + '"><span>Update to this</span></a></div><div class="svg--slide" style="background-color:' + logoTemp.generate.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + returnObj.html + '</div></div></div></div>';
						$(".finalogoSlider").append(slickElement);
						dh_utility_common.changeBg();
						i++;
						if (json.pagination == 1 && i == colorVariantLength) {
							if ($('.load--more--class').length) {
								$('.load--more--class').remove();
							}
							$(".finalogoSlider").append('<div class="load--more--class"><a class="loadMoreColors load--more--button" href="javascript:;"><span class="load--more-shadow"><span class="final--loader loadMoreLogosBoxes" style="display:none;"><img src="' + DH.getAssetImgUrl('logo-maker/loading.svg') + '" /></span>Load More</span></a></div>');
							if (p_fCallBack) {
								p_fCallBack();
							}

						} else {
							if (i === 1) {
								if ($('.load--more--class').length) {
									$('.load--more--class').remove();
								}
							}
							if (json.pagination == 0) {
								if (p_fCallBack) {
									p_fCallBack();
								}

							}
						}

					});
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				//alert(errorThrown);
			}
		});
	}

	function addRecentColor(targetLink) {
		var generateObj = lEditor.currentLogo.generate;
		var color;

		switch (parseInt(targetLink)) {
			case 3:
			case 12: {
				color = generateObj.bgColor;
				break;
			}
			case 13: {
				if (generateObj.mainTextColor.indexOf('url') != -1) {
					color = generateObj.textGradient;
				}
				else {
					color = generateObj.mainTextColor;
				}
				break;
			}
			case 14: {
				if (generateObj.sloganTextColor.indexOf('url') != -1) {
					color = generateObj.sloganGradient;
				}
				else {
					color = generateObj.sloganTextColor;
				}
				break;
			}
			case 15: {
				if (generateObj.iconColor.indexOf('url') != -1) {
					color = generateObj.iconGradient;
				}
				else {
					color = generateObj.iconColor;
				}
				break;
			}
			case 16: {
				if (generateObj.frameColor.indexOf('url') != -1) {
					color = generateObj.iconGradient;
				}
				else {
					color = generateObj.frameColor;
				}

				break;
			}
			case 43: {
				if (generateObj.iconFrameColor.indexOf('url') != -1) {
					color = generateObj.iconFrameGradient;
				}
				else {
					color = generateObj.iconFrameColor;
				}
				break;
			}
		}
		if (color) {
			color = color.replace('#', '');
			if (color && recentColors.indexOf(color) == -1) {
				if (recentColors.length == 8) {
					recentColors.unshift(color);
					recentColors.pop();
				}
				else {
					recentColors.unshift(color);
				}
				saveRecentColor(color);
			}
			refreshRecentColorBox();
		}
	}

	function refreshRecentColorBox() {
		debugConsole("refreshRecentColorBox");
		let content = recentColors.reduce((accm, color) => {
			if (gradientsArray[color]) {
				return accm += '<a href="javascript:;" class="recent-color gradient-color" style="background:' + getGradientStyle(color) + '" data-color="' + color + '"></a>'
			}
			else {
				return accm += '<a href="javascript:;" class="recent-color" style="background-color:#' + color + '" data-color="#' + color + '"></a>'
			}
		}, '');
		if (recentColors.length === 0) {
			$(".color-title").hide();
		}


		$('.colors--variant.recentColorsBox').html(content);
		$('.recentColorsBox a').on('click', function (e) {
			debugConsole("recentColorsBox click", true);
			var color = $(this).data('color');
			var picker = $(this).closest('.colorPicker');

			if (gradientsArray[color]) {
				debugConsole("choosing gradientsArray", true);
				debugConsole("gradientsArray[p_sColor]:=" + gradientsArray[color], true);
				$('.commonClrDiv a').removeClass('active');
				$(this).find('a').addClass('active');
				colorGradient(color);

				//set the color of the picker
				// if (picker) {
				// 	picker.find('.input-group-addon.color-box i')[0].style.background = getGradientStyle(color);
				// }
				updateColorPickerValue(color, false, "", 0);
			}
			else {
				lEditor.logoSlider('final', 1);
				try {
					colorVariation(color);
					// updateColorPickerValue(color, false, "",0);
					//set the color of the picker
					if (picker) {
						picker.colorpicker('setValue', color);
					}
				} catch (e) {
					// $('.finaLogoInner').html('');
					$('.colorNotFound').remove();
					$('.editLogoSlider').removeClass('hidden');
					$('.editFinalLogo').addClass('hidden');
					$(".finalogoSlider").html('<div class="result-option colorNotFound">Not a valid Color code !</div>');
				}
			}
		});
		if ($(".topParent-2").parent("li").hasClass("active") && $(".subMenu-7").parent("li").hasClass("active") && ((!$(".subChild-7").hasClass("hidden"))) && (!($(".previewSection").hasClass("hidden"))) && (($('.editFinalLogo').hasClass("hidden")))) {
			// $('.editFinalLogo').removeClass("hidden");
		}
	}
	//set the color of the picker
	function updateColorPickerValue(p_sColor, p_bIsNoGradientColor, p_sColorDataType, p_nSubChildNum) {
		debugConsole("updateColorPickerValue p_sColor:=" + p_sColor + ",,," + typeof (p_sColor) + ",,,,p_bIsNoGradientColor:=" + p_bIsNoGradientColor);

		let subChildNum;
		var workFor = null;
		if (lEditor.currentLogo.generate.templatePath.isDBLineCompanyText == "yes") {
			workFor = $('.subChild-13').find(".company-text-color-box").attr("last_selected");
		}
		debugConsole("workFor:=" + workFor);
		if (lEditor.getSession("defaultLink") && lEditor.getSession("defaultLink") != "undefined") {
			subChildNum = lEditor.getSession("defaultLink");
		} else {
			subChildNum = lEditor.getSession("targetlink");
		}
		debugConsole("subChildNum:=" + subChildNum);
		let picker = $('.colorpicker-component');
		debugConsole(lEditor.getSession("colorDataType"));
		let gradientColor = "";
		if (picker) {
			let childNum;
			let currentColorDataType;
			if (p_sColorDataType == "") {
				currentColorDataType = lEditor.getSession("colorDataType")
			} else {
				currentColorDataType = p_sColorDataType;
			}
			if (p_nSubChildNum != 0) {
				subChildNum = p_nSubChildNum;
			}
			switch (currentColorDataType) {
				case "background":
					childNum = 0;
					break
				case "foreground":
					switch (parseInt(subChildNum)) {
						case 13:
							childNum = 1;
							if (!p_bIsNoGradientColor) {
								switch (workFor) {
									case "dd-ct-color-line1":
										gradientColor = lEditor.currentLogo.generate.textGradient;
										break;
									case "dd-ct-color-line2":
										gradientColor = lEditor.currentLogo.generate.text2Gradient;
										break;
									case "dd-ct-color-overall":
									default:
										if (lEditor.currentLogo.generate.textGradient && lEditor.currentLogo.generate.textGradient != "") {
											gradientColor = lEditor.currentLogo.generate.textGradient;
										}
										else if (lEditor.currentLogo.generate.text2Gradient && lEditor.currentLogo.generate.text2Gradient != "") {
											gradientColor = lEditor.currentLogo.generate.text2Gradient;
										}
										break;
								}
							}
							break;
						case 14:
							childNum = 2;
							if (!p_bIsNoGradientColor) {
								gradientColor = lEditor.currentLogo.generate.sloganGradient;
							}
							if (p_sColor == "") {
								p_sColor = "#000000";
							}
							break;
						case 15:
							childNum = 3;
							if (!p_bIsNoGradientColor) {
								gradientColor = lEditor.currentLogo.generate.iconGradient;
							}
							if (p_sColor == "") {
								p_sColor = "#000000";
							}
							break;
						case 43:
							childNum = 5;
							if (!p_bIsNoGradientColor) {
								gradientColor = lEditor.currentLogo.generate.iconFrameGradient;
							}
							if (p_sColor == "") {
								p_sColor = "#000000";
							}
							break;
						case 16:
							childNum = 4;
							if (!p_bIsNoGradientColor) {
								if (lEditor.currentLogo.generate.templatePath.frameType === "filled") {
									gradientColor = lEditor.currentLogo.generate.frameFilledGradient;
								} else {
									gradientColor = lEditor.currentLogo.generate.frameGradient;
								}
							}
							if (p_sColor == "") {
								p_sColor = "#000000";
							}
							break;
					}

					break;
			}

			debugConsole("childNum:=" + childNum, true);
			debugConsole("gradientColor:=" + gradientColor, true);
			debugConsole("p_sColor:=" + p_sColor);
			colorBox = picker.find('.input-group-addon.color-box i')[childNum]
			if (gradientColor && gradientColor !== "" && gradientColor !== '') {
				if (gradientsArray[gradientColor]) {
					debugConsole("gradients color", true);
					colorBox.style.background = getGradientStyle(gradientColor);
					picker.find(".colorPickerInput").val(gradientColor + " gradient");
					picker.find(".colorPickerInput").addClass("disabled");
				} else {
					debugConsole("normal color1", true);
					colorBox.style.background = p_sColor;
					picker.find(".colorPickerInput").val(p_sColor);
					picker.find(".colorPickerInput").removeClass("disabled");
				}
			} else {
				debugConsole("normal color2", true);
				colorBox.style.background = p_sColor;
				picker.find(".colorPickerInput").val(p_sColor);
				picker.find(".colorPickerInput").removeClass("disabled");

			}
		}
	}

	// logo listing by color palettes

	function getGradientStyle(color) {
		var stops = gradientsArray[color].stops;
		var content = [];

		stops.forEach(element => {
			content.push(element.color + ' ' + element.offset * 100 + '%');
		});
		return 'linear-gradient(to right, ' + content.join(', ') + ')';
	}

	function palettsColorVariation(editorParameters, p_fCallBack) {
		debugConsole("palettsColorVariation", true);
		var colorId = editorParameters.id;
		loadMoreStart++;
		var limit = 10;
		jqXHR = $.ajax({
			url: DH.baseURL + '/logoMakerAjax.php',
			type: 'POST',
			data: { action: 'paletts', color_id: colorId, start: loadMoreStart },
			async: true,
			success: function (json) {
				json = getValidJsonParseObj(json);
				if (json.status == 0) {

				} else {
					var colorVariant = json.colors;
					var targetLink = parseInt(lEditor.getSession('targetlink'));
					var colorDataType = lEditor.getSession('colorDataType');
					if (typeof colorDataType === 'undefined') {
						colorDataType = 'background';
					}
					var logoTemp = getValidJsonParseObj(lEditor.getSession('currentLogo'));
					var i = 0;

					var k = (loadMoreStart - 1) * limit;
					var type = '';

					if (loadMoreStart == 1) {
						lEditor.logoTempArr = [];
						lEditor.logoSlider('final', 1);
					}
					var color = '';
					var colorVariantLength = colorVariant.length;
					// $('.load--more--class').remove();
					if (colorVariantLength == 0) {
						return false;
					}

					var returnObj = {};
					$('.editFinalLogo').addClass('hidden');
					$('.editLogoSlider').removeClass('hidden');

					var templateIdStyle = getTempStyle();

					$.each(colorVariant, function (kee, v) {

						var idKey = logoMakerFunction.genRandomId();
						logoTemp.cpId = v.color_id;
						logoTemp.generate.idKey = idKey;


						logoTemp.generate.bgColor = v.bg_color;
						constantVars.colors.bgColorFamily = v.color_parent;

						var textColor = v.text_color;
						var frameColor = v.frame_color;
						var frameFilledColor = v.filled_frame_color;
						var iconFrameColor = v.frame_color;
						var iconColor = v.icon_color;
						var sloganColor = v.slogan_color;

						if (gradientsArray[v.text_color]) {
							logoTemp.generate.mainTextColor = "";
							logoTemp.generate.textGradient = v.text_color;
							textColor = getGradientStyle(v.text_color);

							logoTemp.generate.mainText2Color = "";
							logoTemp.generate.text2Gradient = v.text_color;
						}
						else {
							logoTemp.generate.textGradient = "";
							logoTemp.generate.mainTextColor = v.text_color;

							logoTemp.generate.text2Gradient = "";
							logoTemp.generate.mainText2Color = v.text_color;
						}
						constantVars.colors.mainTextFamily = v.color_parent;

						if (gradientsArray[v.icon_color]) {
							logoTemp.generate.iconColor = "";
							logoTemp.generate.iconGradient = v.icon_color;
							iconColor = getGradientStyle(v.icon_color);
						}
						else {
							logoTemp.generate.iconGradient = "";
							logoTemp.generate.iconColor = v.icon_color;
						}
						constantVars.colors.iconFamily = v.color_parent;

						if (gradientsArray[v.frame_color]) {
							logoTemp.generate.frameColor = "";
							logoTemp.generate.frameGradient = v.frame_color;
							frameColor = getGradientStyle(v.frame_color);
						}
						else {
							logoTemp.generate.frameGradient = "";
							logoTemp.generate.frameColor = v.frame_color;
						}

						if (gradientsArray[v.filled_frame_color]) {
							logoTemp.generate.frameFilledColor = "";
							logoTemp.generate.frameFilledGradient = v.filled_frame_color;
							frameFilledColor = getGradientStyle(v.filled_frame_color);
						}
						else {
							logoTemp.generate.frameFilledGradient = "";
							logoTemp.generate.frameFilledColor = v.filled_frame_color;
						}

						constantVars.colors.frameFamily = v.color_parent;

						if (gradientsArray[v.frame_color]) {
							logoTemp.generate.iconFrameColor = "";
							logoTemp.generate.iconFrameGradient = v.frame_color;
							frameFilledColor = getGradientStyle(v.frame_color);
							v.icon_frame_color = v.frame_color;
						}
						else {
							logoTemp.generate.iconFrameGradient = "";
							logoTemp.generate.iconFrameColor = v.frame_color;
							v.icon_frame_color = v.frame_color;
						}

						constantVars.colors.iconFrameFamily = v.color_parent;

						if (gradientsArray[v.slogan_color]) {
							logoTemp.generate.sloganTextColor = "";
							logoTemp.generate.sloganGradient = v.slogan_color;
							sloganColor = getGradientStyle(v.slogan_color);
						}
						else {
							logoTemp.generate.sloganGradient = "";
							logoTemp.generate.sloganTextColor = v.slogan_color;
						}

						constantVars.colors.sloganTextFamily = v.color_parent;
						returnObj = logoMakerFunction.generateLogoTemplateByOption(logoTemp, type, idKey);
						logoTemp.generate = returnObj.logoObj;
						lEditor.logoTempArr[k] = getValidJsonParseObj(getValidJsonStringifyObj(logoTemp));
						var favoriteStatus = "";
						var toolTxt = "Add to favorites";
						var dataLogoId = 0;
						var subType = $('.colorPaletteButton.active').attr('data-id');
						if (typeof subType === 'undefined') {
							subType = $('.colorPaletteVariants a.active').attr('data-id');
						}
						var favData = logoMakerFunction.isExistInFavoriteJson('colorPallete', subType, k);
						if (favData !== false) {
							favoriteStatus = "active";
							toolTxt = "Remove from favorites";
							dataLogoId = favData;
						}

						var templateHint = showLogoAdminIds(logoTemp.generate.templatePath, logoTemp.sloganName, logoTemp.fId, logoTemp.cpId, logoTemp.sfId, logoTemp.frmId, logoTemp.iconFrameId, logoTemp.monofId);

						slickElement = '<div class="logos--boxes color-logo-boxes color--variation" data-cpId = "' + v.color_id + '"><div class="item logo--slides logoSlides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="logo-favourite iconFav ' + favoriteStatus + '" data-toggle="tooltip" title="" data-type="favorite" data-listType = "colorPallete" data-id="' + (k) + '" data-logo-id="' + dataLogoId + '" data-original-title="' + toolTxt + '"><i class="icon icon-heart"></i></div><div class="logoSlide-overlay gradient-div"><a href="javascript:;" class="icons-edit icons-update setDefaultLogo" data-type="color"  data-id="' + (k++) + '"><span>Update to this</span></a></div><div class="svg--slide" style="background-color : ' + logoTemp.generate.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + returnObj.html + '</div></div></div><div class="color-palette-name"><span>' + v.color_name + '</span>';
						slickElement += '<div class="color-palettes">';
						if (logoTemp.generate.templatePath.isFrame != 0 && logoTemp.generate.framePath != "") {
							if (logoTemp.generate.templatePath.frameType == 'outline') {
								slickElement += '<a href="javascript:;" style="background:' + frameColor + '" data-toggle="tooltip" data-html="true" data-original-title="Container Color : ' + v.frame_color + '"></a>';
							} else {
								slickElement += '<a href="javascript:;" style="background:' + frameFilledColor + '" data-toggle="tooltip" data-html="true" data-original-title="Filled Container Color : ' + v.filled_frame_color + '"></a>';
							}
						}
						if (logoTemp.generate.templatePath.isIcon != 0) {
							slickElement += '<a href="javascript:;" style="background:' + iconColor + '" data-toggle="tooltip" data-html="true" data-original-title="Symbol Color : ' + v.icon_color + '"></a>';
						}
						if (logoTemp.generate.templatePath.isMono != 0) {
							slickElement += '<a href="javascript:;" style="background:' + iconColor + '" data-toggle="tooltip" data-html="true" data-original-title="Monogram Color : ' + v.icon_color + '"></a>';
						}
						if (logoTemp.generate.templatePath.isIconFrame != 0) {
							slickElement += '<a href="javascript:;" style="background:' + iconFrameColor + '" data-toggle="tooltip" data-html="true" data-original-title="Inner Container Color : ' + v.icon_frame_color + '"></a>';
						}
						if (logoTemp.sloganName != "") {
							slickElement += '<a href="javascript:;" style="background:' + sloganColor + '" data-html="true" data-toggle="tooltip" data-original-title="Slogan Color : ' + v.slogan_color + '"></a>';
						}
						if (logoTemp.logoName != "") {
							slickElement += '<a href="javascript:;" style="background:' + textColor + '" data-html="true" data-toggle="tooltip" data-original-title="Company Name Color : ' + v.text_color + '"></a>';
						}
						slickElement += '<a href="javascript:;" data-html="true" style="background-color:' + v.bg_color + '" data-toggle="tooltip" data-original-title="Background Color : ' + v.bg_color + '"></a>';
						slickElement += '</div>';
						slickElement + '</div></div>';

						$(".finalogoSlider").append(slickElement);
						dh_utility_common.changeBg();
						i++;
						if (json.pagination == 1 && i == colorVariantLength) {
							if ($('.load--more--class').length) {
								$('.load--more--class').remove();
							}
							$(".finalogoSlider").append('<div class="load--more--class"><a class="loadMorePaletts load--more--button" href="javascript:;"><span class="load--more-shadow"><span class="final--loader loadMoreLogosBoxes" style="display:none;"><img src="' + DH.getAssetImgUrl('logo-maker/loading.svg') + '" /></span>Load More</span></a></div>');
							if (p_fCallBack) {
								p_fCallBack();
							}
						} else {
							if (i == 1) {
								if ($('.load--more--class').length) {
									$('.load--more--class').remove();
								}
							}

							if (json.pagination == 0) {
								if (p_fCallBack) {
									p_fCallBack();
								}
							}
						}

					});
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				//alert(errorThrown);
			}
		});
	}

	// for pagination 
	$('body').on('click', '.loadMoreColors', function () {
		debugConsole("loadMoreColors click");
		$('.loadMoreLogosBoxes').css({ 'display': 'inline-block' });
		var scrollLastHeight = $('.step_7').find(".finalogoSlider").height();
		fixedColorVariation(editorParameters, function () {
			var scrollGap = $('.step_7').find(".finalogoSlider").height() - scrollLastHeight;
			$("html, body").animate({
				scrollTop: $('.step_7').find(".finalogoSlider").height() - scrollGap
			}, { duration: 'fast', easing: 'linear' });
		});
	});

	$('body').on('click', '.loadMorePaletts', function () {
		debugConsole("loadMorePaletts click");
		$('.loadMoreLogosBoxes').css({ 'display': 'inline-block' });
		var scrollLastHeight = $('.step_7').find(".finalogoSlider").height();
		palettsColorVariation(editorParameters, function () {
			var scrollGap = $('.step_7').find(".finalogoSlider").height() - scrollLastHeight;
			$("html, body").animate({
				scrollTop: $('.step_7').find(".finalogoSlider").height() - scrollGap
			}, { duration: 'fast', easing: 'linear' });
		});
	});


	$('body').on('click', '.loadMoreGenerate', function () {
		//$('.loadMoreLogosBoxes').css({ 'display': 'inline-block' });
		debugConsole("loadMoreGenerate click");
		$(".loadMoreGenerate").addClass('activating');
		var scrollLastHeight = $('.step_6').find(".sliderContainer").height();
		var scrollGap = 0;
		if (version == "v6") {
			if ($(".step6-logo-section").find(".sliderContainer").width() > $(".step6-logo-section").find(".sliderContainer").height()) {
				scrollLastHeight = $(".step6-logo-section").find(".sliderContainer").width()
			} else {
				scrollLastHeight = $(".step6-logo-section").find(".sliderContainer").height();
			}
		} else {
			scrollLastHeight = $('.step_6').find(".sliderContainer").height();
		}
		lEditor.generateDynamicLogos(true, function () {
			if (version == "v6") {
				if ($(".step6-logo-section").find(".sliderContainer").width() > $(".step6-logo-section").find(".sliderContainer").height()) {
					debugConsole("111");
					scrollGap = $(".step6-logo-section").find(".sliderContainer").width() - scrollLastHeight;
					$(".step6-left-section").animate({
						scrollLeft: $(".step6-logo-section").find(".sliderContainer").width() - scrollGap
					}, 'slow');
				} else {
					debugConsole("222");
					scrollGap = $(".step6-logo-section").find(".sliderContainer").height() - scrollLastHeight;
					$(".step6-left-section").animate({
						scrollTop: $(".step6-logo-section").find(".sliderContainer").height() - scrollGap
					}, 'fast');
				}
			} else {
				debugConsole("$('html').height():=" + $('.step_6').find(".sliderContainer").height());
				scrollGap = $('.step_6').find(".sliderContainer").height() - scrollLastHeight;
				$("html, body").animate({
					scrollTop: $('.step_6').find(".sliderContainer").height() - scrollGap
				}, 'fast');
			}

		});
	});

	// check icon is available or not in logo 
	function isIconAvail() {
		debugConsole("isIconAvail:");
		var currLogo = getValidJsonParseObj(lEditor.getSession('currentLogo'));
		var isIcon = currLogo.generate.templatePath.isIcon;
		var editIconVal = lEditor.getSession('iconValue');
		debugConsole("isIcon:=" + isIcon);
		debugConsole("editIconVal:=" + editIconVal);
		if (isIcon == 0) {
			$('.layoutDisplay').addClass('hidden');
			$('.symbolVariations').removeClass('hidden');
			$('.noResultFound').show();
			loadMoreStart = 0;
			if (editIconVal != null && editIconVal != 'undefined' && editIconVal != '') {
				$('.editFinalLogo, .previewSection').addClass('hidden');
				$('.editLogoSlider, .currentLogoBox').removeClass('hidden');
				lEditor.editIconsData();
			} else {
				$('.editFinalLogo, .previewSection').addClass('hidden')
				$('.editLogoSlider, .currentLogoBox').removeClass('hidden');
			}
			$('.finalogoSlider').html('<div class="icons-blank result-option iconBlank">' + forSearchSymbol + '</div>');
			lEditor.cleanSession('iconValue');

		} else {
			$('.layoutDisplay, .editSymbolsSection').removeClass('hidden');
			$('.symbolVariations').addClass('hidden');
			$('.noResultFound').hide();
		}

	}

	// check monogram is available or not 
	function isMonoAvail() {
		debugConsole("isMonoAvail");
		var currLogo = getValidJsonParseObj(lEditor.getSession('currentLogo'));
		var isMono = currLogo.generate.templatePath.isMono;
		debugConsole("isMono:=" + isMono);
		if (parseInt(isMono) == 0) {
			$('.layoutDisplay, .cancel--symbol, .editFinalLogo, .previewSection').addClass('hidden');
			$('.monoVariations, .editLogoSlider').removeClass('hidden');
			lEditor.getMonogramVariations("");
		} else if (parseInt(isMono) == 1) {
			$('.layoutDisplay, .editMonoSection, .editFinalLogo').removeClass('hidden');
			$('.monoVariations, .editLogoSlider').addClass('hidden');
		}
	}

	// color listing 

	function colorVariation(colorVal) {
		debugConsole("colorVariation");
		var workFor = null;
		if (lEditor.currentLogo.generate.templatePath.isDBLineCompanyText == "yes") {
			workFor = $('.subChild-13').find(".company-text-color-box").attr("last_selected");
		}
		lEditor.logoSlider('final', 1);
		var dataOption = colorVal;
		var colorVariant = logoMakerFunction.getShadesOfColor(dataOption);
		var targetLink = parseInt(lEditor.getSession('targetlink'));
		var colorDataType = lEditor.getSession('colorDataType');
		if (typeof colorDataType === 'undefined') {
			colorDataType = 'background';
		}
		lEditor.logoTempArr = [];
		var logoTemp = getValidJsonParseObj(lEditor.getSession('currentLogo'));
		var i = 0;
		var k = 0;
		var type = '';
		var color = '';
		var colorVariantLength = colorVariant.length;
		var returnObj = {};
		$('.editFinalLogo').addClass('hidden');
		$('.editLogoSlider').removeClass('hidden');
		debugConsole("colorDataType:=" + colorDataType);
		$.each(colorVariant, function (k, v) {
			var idKey = logoMakerFunction.genRandomId();
			logoTemp.generate.idKey = idKey;
			switch (colorDataType) {
				case 'background': {
					color = "" + v;

					logoTemp.generate.bgColor = color;
					constantVars.colors.bgColorFamily = dataOption;
					returnObj = logoMakerFunction.generateLogoTemplateByOption(logoTemp, type, idKey);
					break;
				}
				case 'foreground': {
					var j = 0;
					$('.colorSection .subnav li.active').each(function () {
						color = "" + v;
						var option = $(this).find('a').data('target');
						switch (option) {
							case 13: {
								switch (workFor) {
									case "dd-ct-color-line1":
										logoTemp.generate.mainTextColor = color;
										logoTemp.generate.textGradient = "";
										break;
									case "dd-ct-color-line2":
										logoTemp.generate.mainText2Color = color;
										logoTemp.generate.text2Gradient = "";
										break;
									case "dd-ct-color-overall":
									default:
										logoTemp.generate.mainTextColor = color;
										logoTemp.generate.textGradient = "";
										logoTemp.generate.mainText2Color = color;
										logoTemp.generate.text2Gradient = "";
										break;
								}
								constantVars.colors.mainTextFamily = dataOption;
								break;
							}
							case 14: {
								logoTemp.generate.sloganTextColor = color;
								logoTemp.generate.sloganGradient = "";
								constantVars.colors.sloganTextFamily = dataOption;
								break;
							}
							case 15: {
								logoTemp.generate.iconColor = color;
								logoTemp.generate.iconGradient = "";
								constantVars.colors.iconFamily = dataOption;
								break;
							}
							case 16: {

								if (logoTemp.generate.templatePath.frameType == "filled") {
									logoTemp.generate.frameFilledColor = color;
									logoTemp.generate.frameFilledGradient = "";
								} else {
									logoTemp.generate.frameColor = color;
									logoTemp.generate.frameGradient = "";
								}
								logoTemp.generate.frameColor = color;
								logoTemp.generate.frameGradient = "";
								constantVars.colors.frameFamily = dataOption;
								break;
							}
							case 43: {
								logoTemp.generate.iconFrameColor = color;
								logoTemp.generate.iconFrameGradient = "";
								constantVars.colors.iconFrameFamily = dataOption;
								break;
							}
						}
						returnObj = logoMakerFunction.generateLogoTemplateByOption(logoTemp, type, idKey);
						j++;
					});
				}
			}
			logoTemp.generate = returnObj.logoObj;
			lEditor.logoTempArr[k] = getValidJsonParseObj(getValidJsonStringifyObj(logoTemp));
			$('.colorNotFound').remove();
			slickElement = '<div class="logos--boxes"><div class="item logo--slides logoSlides"><div class="logo-favourite iconFav" data-toggle="tooltip" title="" data-type="favorite" data-id="' + (k) + '" data-logo-id="0" data-original-title="Add to favorites"><i class="icon icon-heart"></i></div><div class="logoSlide-overlay gradient-div"><a href="javascript:;" class="icons-edit icons-update setDefaultLogo" data-type="color" data-id="' + (k++) + '"><span>Update to this</span></a></div><div class="svg--slide" style="background-color:' + logoTemp.generate.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + returnObj.html + '</div></div></div></div>';
			$(".finalogoSlider").append(slickElement);
			dh_utility_common.changeBg();
			i++;
		});
	}
	// for setting scale of group in svg
	function setScale(width, currWidth, height, currHeight) {
		var scale = 1;
		var wScale = 1;
		var hScale = 1;
		if (currWidth > width) {
			wScale = 1 * (width / currWidth);
		}
		if (currHeight > height) {
			hScale = 1 * (height / currHeight);
		}
		scale = wScale;
		if (wScale > hScale) {
			scale = hScale;
		}
		if (scale == 0) scale = 1;
		return scale;

	}
	// for updating current object 
	function updateCurrLogoObject(obj) {
		debugConsole("updateCurrLogoObject");
		var generate = {};

		generate = $.extend(true, {}, obj);//getValidJsonParseObj(getValidJsonStringifyObj(obj));
		// debugConsole("generate:=" + JSON.stringify(generate));
		if (generate.generate.templatePath.isIcon == 1 || generate.generate.templatePath.isMono == 1) {
			if (typeof generate.generate.templatePath.iconFrameBox !== 'undefined') {
				if (typeof generate.generate.templatePath.iconFrameBox.x !== 'undefined' || generate.generate.templatePath.updates.iconFrameBox.x !== 'undefined') {
					generate.generate.templatePath.iconFrameBox.x = generate.generate.templatePath.updates.iconFrameBox.x;
					generate.generate.templatePath.iconFrameBox.y = generate.generate.templatePath.updates.iconFrameBox.y;
					generate.generate.templatePath.iconFrameBox.scale = generate.generate.templatePath.updates.iconFrameBox.scale;
				}
			}
			if (typeof generate.generate.templatePath.icon.x !== 'undefined') {
				generate.generate.templatePath.icon.x = generate.generate.templatePath.updates.icon.x;
				generate.generate.templatePath.icon.y = generate.generate.templatePath.updates.icon.y;
				generate.generate.templatePath.icon.scale = generate.generate.templatePath.updates.icon.scale;
			}
		}

		if (generate.generate.templatePath.isDBLineCompanyText == "yes") {
			if (typeof generate.generate.templatePath.text1.x !== 'undefined') {
				generate.generate.templatePath.text1.x = generate.generate.templatePath.updates.text1.x;
				generate.generate.templatePath.text1.y = generate.generate.templatePath.updates.text1.y;
				generate.generate.templatePath.text1.scale = generate.generate.templatePath.updates.text1.scale;
			}
			if (typeof generate.generate.templatePath.text2.x !== 'undefined') {
				generate.generate.templatePath.text2.x = generate.generate.templatePath.updates.text2.x;
				generate.generate.templatePath.text2.y = generate.generate.templatePath.updates.text2.y;
				generate.generate.templatePath.text2.scale = generate.generate.templatePath.updates.text2.scale;
			}
		} else {
			if (typeof generate.generate.templatePath.text.x !== 'undefined') {
				generate.generate.templatePath.text.x = generate.generate.templatePath.updates.text.x;
				generate.generate.templatePath.text.y = generate.generate.templatePath.updates.text.y;
				generate.generate.templatePath.text.scale = generate.generate.templatePath.updates.text.scale;
			}
		}


		if (typeof generate.generate.templatePath.slogan.x !== 'undefined') {
			generate.generate.templatePath.slogan.x = generate.generate.templatePath.updates.slogan.x;
			generate.generate.templatePath.slogan.y = generate.generate.templatePath.updates.slogan.y;
			generate.generate.templatePath.slogan.scale = generate.generate.templatePath.updates.slogan.scale;
		}

		if (typeof generate.generate.templatePath.textAndSlogan.x !== 'undefined') {
			generate.generate.templatePath.textAndSlogan.x = generate.generate.templatePath.updates.textAndSlogan.x;
			generate.generate.templatePath.textAndSlogan.y = generate.generate.templatePath.updates.textAndSlogan.y;
			generate.generate.templatePath.textAndSlogan.scale = generate.generate.templatePath.updates.textAndSlogan.scale;
		}

		if (typeof generate.generate.templatePath.containerBody.x !== 'undefined') {
			generate.generate.templatePath.containerBody.x = generate.generate.templatePath.updates.containerBody.x;
			generate.generate.templatePath.containerBody.y = generate.generate.templatePath.updates.containerBody.y;
			generate.generate.templatePath.containerBody.scale = generate.generate.templatePath.updates.containerBody.scale;
		}

		if (typeof generate.generate.templatePath.logoContainer.x !== 'undefined') {
			generate.generate.templatePath.logoContainer.x = generate.generate.templatePath.updates.logoContainer.x;
			generate.generate.templatePath.logoContainer.y = generate.generate.templatePath.updates.logoContainer.y;
			generate.generate.templatePath.logoContainer.scale = generate.generate.templatePath.updates.logoContainer.scale;
		}

		if (generate.generate.templatePath.isIconFrame == 1) {

			if (typeof generate.generate.templatePath.iconFrame.x !== 'undefined' || generate.generate.templatePath.updates.iconFrame.x !== 'undefined') {
				generate.generate.templatePath.iconFrame.x = generate.generate.templatePath.updates.iconFrame.x;
				generate.generate.templatePath.iconFrame.y = generate.generate.templatePath.updates.iconFrame.y;
				generate.generate.templatePath.iconFrame.scale = generate.generate.templatePath.updates.iconFrame.scale;
				//	alert(generate.generate.templatePath.iconFrame.scale);
			}
		}

		if (generate.generate.templatePath.isFrame == 1) {
			if (typeof generate.generate.templatePath.frame.x !== 'undefined' || generate.generate.templatePath.updates.frame.x !== 'undefined') {
				generate.generate.templatePath.frame.x = generate.generate.templatePath.updates.frame.x;
				generate.generate.templatePath.frame.y = generate.generate.templatePath.updates.frame.y;
				generate.generate.templatePath.frame.scale = generate.generate.templatePath.updates.frame.scale;
			}
		}
		return generate;
	}
	// saving logo  
	$('#saveIcon').click(function () {
		debugConsole("saveIcon");
		$(this).addClass('animated');
		setTimeout(function () { $('.topActionBtn').removeClass('animated'); }, 1500);
		lEditor.currentLogo.currencyId = lEditor.getSession('currencyId');
		var logoId = lEditor.getCurrentLogoId();
		var dataAnalysisObj = getDataAnalsyis(lEditor.currentLogo, false);
		jqXHR = $.ajax({
			url: DH.baseURL + '/logoMakerAjax.php',
			type: 'POST',
			beforeSend: function () {
			},
			data: { action: 'save', logo_id: logoId, 'curr_logo': lEditor.validateJSON(lEditor.currentLogo, dataAnalysisObj), 'svg_logo': logoMakerFunction.getFinalLogoTemplate(lEditor.currentLogo.generate), data_analysis: dataAnalysisObj, exceptions: JSON.stringify(createLogging("saveIcon click")) },
			async: false,
			success: function (json) {
				json = getValidJsonParseObj(json);
				if (json.status == 0) {
					lEditor.alertMessages('error', json.msg);
				} else {
					lEditor.alertMessages('success', json.msg);
					lEditor.setCurrentLogoId(json.data.logo_id);
				}
				clearException();
			},
			error: function (jqXHR, textStatus, errorThrown) {
				//alert(errorThrown);
			}
		});

	});
	// copieng logo 
	$('#copyIcon').click(function () {
		$(this).addClass('animated');
		setTimeout(function () { $('.topActionBtn').removeClass('animated'); }, 1500);
		lEditor.currentLogo.currencyId = lEditor.getSession('currencyId');
		var dataAnalysisObj = getDataAnalsyis(lEditor.currentLogo, false);
		jqXHR = $.ajax({
			url: DH.baseURL + '/logoMakerAjax.php',
			type: 'POST',
			beforeSend: function () {

			},
			data: { action: 'save', logo_id: 0, 'curr_logo': lEditor.validateJSON(lEditor.currentLogo, dataAnalysisObj), 'svg_logo': logoMakerFunction.getFinalLogoTemplate(lEditor.currentLogo.generate), data_analysis: dataAnalysisObj, exceptions: JSON.stringify(createLogging("copyIcon click")) },
			async: false,
			success: function (json) {
				json = getValidJsonParseObj(json);
				if (json.status == 0) {
					lEditor.alertMessages('error', json.msg);
				} else {
					lEditor.setCurrentLogoId(json.data.logo_id);
					lEditor.alertMessages('success', json.msg);
					$('.savedLogoCount').html('(' + json.data.saved_count + ')');
					$('.favLogoCount').html('(' + json.data.fav_count + ')');
				}
				clearException();
			},
			error: function (jqXHR, textStatus, errorThrown) {
			}
		});
	});
	$('body').on('click', '.confirmDelete', function () {
		debugConsole("confirmDelete click");
		var confirmId = $(this).attr('data-logoid');
		var msgBox = $('.favoriteLogoTab .no-favourite');

		jqXHR = $.ajax({
			url: DH.baseURL + '/logoMakerAjax.php',
			type: 'POST',
			data: { action: 'delete', logo_id: confirmId },
			async: false,
			success: function (json) {
				json = getValidJsonParseObj(json);
				if (json.status == 0) {

				} else {
					$('[data-id="' + confirmId + '"]').parents('.savedLogoLists').remove();
					$('[data-id="' + confirmId + '"]').parents('.favoriteLogoLists').remove();
					$('.savedLogoCount').html('(' + json.saved_count + ')');
					$('.favLogoCount').html('(' + json.favorite_count + ')');
					msgBox[$('.favoriteLogoLists.saved-logo-lists').length == 0 ? 'show' : 'hide']();
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				alert(errorThrown);
			}
		});
		$('#myModal').modal('hide');
	})

	// removing logo 	
	$('body').on('click', '.removeLogo', function (e) {
		debugConsole("removeLogo click");
		e.stopPropagation();
		var obj = $(this);
		var logoId = $(this).data('id');
		$('.confirmDelete').attr('data-logoid', logoId);
		$('#myModal').modal('show');
	});

	// sharing logo
	$('body').on('click', '.shareButton, .shareLogo', function (e) {
		debugConsole("shareButton click");
		e.stopPropagation();
		$('#share-modal').modal('show');
		$('.btnCopy').text('Copy');
		lEditor.previewColors();
		lEditor.previewLogo();
	});

	$('.share-modal-popup').on('click', '.shareCommon', function () {
		var getId = $(this).data('id');
		$(this).addClass('active');
		$(this).siblings().removeClass('active');
		$(getId).addClass('active');
		$(getId).siblings().removeClass('active');
	});



	$('.loginOption').on('click', function () {
		$('.le--sidenavbar').addClass('focusable');
		$('.li-side--menu').animate({ right: '0px' }, 'fast');
		$('.le--sidenavbar').css({ 'background-color': 'rgba(0,0,0,0.4)', 'z-index': '9999', 'right': '0px' });
		$('body').css('overflow', 'hidden');

	});
	$('body').on('click', '.le--close', function () {
		$('.li-side--menu').animate({ right: '-420px' }, 'fast', function () {
			$('.le--sidenavbar').css('right', '-100%');
			$('body').css('overflow', 'auto');
			$('.le--sidenavbar').removeClass('focusable');
		});

	})
	$('body').on('click', '.le--sidenavbar', function (e) {
		if (!$(e.target).closest('.li-side--menu').length) {
			$('.li-side--menu').animate({ right: '-420px' }, 'fast', function () {
				$('.le--sidenavbar').css('right', '-100%');
				$('body').css('overflow', 'auto');
				$('.le--sidenavbar').removeClass('focusable');
			});
		}
	});

	$('.logoVariations').on('click', function () {
		debugConsole("logoVariations click");
		$('.logoVariationContainer').append('<div class="logo-variation-container logoContainer"></div>');
		$('.logoVariationContainer .sliderContainer').addClass('active');
		$('body').css('overflow', 'hidden');
	});

	$('body').on('click', '.logoContainer, .closeVariation', function (e) {
		if (e.target == this) {
			$('.logoVariationContainer .sliderContainer').removeClass('active');
			setTimeout(function () {
				$('.logoContainer').remove();
				$('body').css('overflow', 'auto');
			}, 300);
		}
	});

	// Open Logo detail from saved and favourite logo section 
	$('body').on('click', '.openLogoDetail', function () {
		debugConsole("Open Logo detail from saved and favourite logo section");
		var obj = $(this);
		var logoId = $(this).data('id');
		var editorId = logoId * 11;

		window.location.href = DH.baseURL + '/tools/logo-maker?editor=' + editorId;
	});

	$('body').on('click', '.setSaveDefaultLogo', function () {
		debugConsole("setSaveDefaultLogo click");
		var obj = $(this);
		var logoId = $(this).data('id');
		jqXHR = $.ajax({
			url: DH.baseURL + '/logoMakerAjax.php',
			type: 'POST',
			data: { action: 'default_logo', logo_id: logoId },
			async: false,
			success: function (json) {
				json = getValidJsonParseObj(json);
				if (json.status == 0) {

				} else {
					var logo = json.data.logo;
					lEditor.setCurrentLogoId(logo.logo_id);
					lEditor.setSession('sloganText', logo.logo_slogan);
					lEditor.updateFontsObject('logo');
					lEditor.updateFontsObject('logoName2');
					lEditor.updateFontsObject('slogan');
					lEditor.setSession('logoname', logo.logo_name);
					lEditor.setSession('currentLogo', logo.logo_json);
					$('.commonEditSection').addClass('hidden');
					lEditor.setSession('targetlink', 1);
					lEditor.setSession('parentlink', 0);
					lEditor.setSession('defaultlink', 0);
					$('.table-menu li, .currentLogoContainer,.logoTab').removeClass('active');
					$('.logosTabBox').removeClass('tabActive');
					$('.logoTab:first-child').addClass('active');
					$('.closeCurrentLogo, .expandLogo').hide();
					$('body').css('overflow', 'auto');
					debugConsole("editLogoSteps7");
					lEditor.editLogoSteps();
					lEditor.previewColors();
					lEditor.previewLogo();
					// $('.editSloganName').val(lEditor.getSession('sloganText'));
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				//alert(errorThrown);
			}
		});
	});
	// saving logo after using slidre
	function saveSliderData() {
		var logoId = lEditor.getCurrentLogoId();
		var dataAnalysisObj = getDataAnalsyis(lEditor.currentLogo, false);
		lEditor.setSession('currentLogo', getValidJsonStringifyObj(lEditor.currentLogo));

		jqXHR = $.ajax({
			url: DH.baseURL + '/logoMakerAjax.php',
			type: 'POST',
			beforeSend: function () {
			},
			data: { action: 'save', logo_id: logoId, 'curr_logo': lEditor.validateJSON(lEditor.currentLogo, dataAnalysisObj), 'svg_logo': logoMakerFunction.getFinalLogoTemplate(lEditor.currentLogo.generate), data_analysis: dataAnalysisObj, exceptions: JSON.stringify(createLogging("on saveSliderData")) },
			async: true,
			success: function (json) {
				json = getValidJsonParseObj(json);
				if (json.status == 0) {
					lEditor.alertMessages('error', json.msg);
				} else {
					lEditor.alertMessages('success', json.msg);
					lEditor.setCurrentLogoId(json.data.logo_id);
				}
				clearException();
			},
			error: function (jqXHR, textStatus, errorThrown) {
				//alert(errorThrown);
			}
		});
		lEditor.previewColors();
		lEditor.previewLogo();

	}

	// for pagination 
	$('body').on('click', '.loadMoreSavedLogos', function () {
		getSavedLogoListing();
	});

	$('body').on('click', '.loadMoreFavoriteLogos', function () {
		getFavoriteLogoListing();
	});

	// by tushar 
	function getSavedLogoListing() {
		debugConsole("getSavedLogoListing");
		var htm = "";
		var currLogoId = lEditor.getCurrentLogoId();

		savedPagination++;
		if (savedPagination == 1) {
			$('.savedLogo').append('<div class="loadMoreIcons common--loader text-center"><div class="cssload-container"><div class="cssload-speeding-wheel"></div></div></div>');
		}
		jqXHR = $.ajax({
			url: DH.baseURL + '/logoMakerAjax.php',
			type: 'POST',
			data: { action: 'listing', start: savedPagination },
			async: true,
			success: function (json) {
				$('.loadMoreIcons').remove();
				json = getValidJsonParseObj(json);
				if (json.status == 0) {

				} else {

					var i = 0;
					$('.loadMoreSavedLogos').parents('.load--more--class').remove();
					if (json.data.logos.length == 0) { return false; }
					$.each(json.data.logos, function (k, v) {
						var closeHtml = '';
						var defaultHtml = '';
						var activeFav = '';
						var favToolTip = 'Add to favorites';
						if (v.logo_is_favorite == 1) {
							activeFav = 'active';
							favToolTip = 'Remove from favorites';
						}
						if (currLogoId != v.logo_id) {
							closeHtml = '<img src="' + DH.getAssetImgUrl('logo-maker/close.svg') + '" class="removeLogo" data-id="' + v.logo_id + '">';
							defaultHtml = '<div class="logoSlide-overlay gradient-div"><a href="javascript:;" class="icons-edit icons-update openLogoDetail" data-id="' + v.logo_id + '"><span>Update to this</span></a></div>';
							dh_utility_common.changeBg();
						}
						$('.savedLogo').append('<div class="savedLogoLists saved-logo-lists" style="background-color:' + v.bg_color + '"><div class="water-mark-img"></div><div class="logo-favourite favLogoIcon ' + activeFav + '" data-placement="bottom" data-toggle="tooltip" title="" data-id="' + v.logo_id + '" data-original-title="' + favToolTip + '"><i class="icon icon-heart"></i></div>' + closeHtml + ' ' + v.logo_svg + ' ' + defaultHtml + '</div>');
						i++;
						if (json.pagination == 1 && i == json.data.logos.length) {
							$('.savedLogo').append('<div class="load--more--class"><a class="loadMoreSavedLogos load--more--button" href="javascript:;"><span class="load--more-shadow"><span class="final--loader loadMoreLogosBoxes" style="display:none;"><img src="' + DH.getAssetImgUrl('logo-maker/loading.svg') + '" /></span>Load More</span></a></div>');
						}
					});
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				//alert(errorThrown);
			}
		});

	};

	// by tushar     
	function userLoginPopup() {
		login.openSignupBox();
	}

	// restricting back button 
	window.history.pushState('', null, '');
	$(window).on('popstate', function () {
		var page = parseInt(sessionStorage.getItem('currPage'));
		if (page == 7) {
			return true;
		} else if (page == 1 || isNaN(page)) {
			history.go(-1);
			return false;
		} else if (page == 2) {
			window.history.pushState('', null, '');
			sessionStorage.setItem('currPage', 1);
			return true;
		} else {

			page = page - 1;
			if (page < 6) {
				$("#logomaker_signup_box").modal('hide');
				$("#logomaker_login_box").modal('hide');
			}
			window.history.pushState('', null, '');
			sessionStorage.setItem('currPage', page);

			lEditor.showStep();
			return false;
		}
		return true;
	});


	$('#industryName').change(function () {
		if ($(this).val() == 2010) {
			$(".extra--industry").show();
		} else {
			$(".extra--industry").hide();
		}
	});

	// changing template of logo ( left ,right ,down ,up )
	$('.layoutTemplate').click(function (e) {
		e.stopImmediatePropagation();
		var type = $(this).data('option');
		var currLogo = getValidJsonParseObj(lEditor.getSession('currentLogo'));
		let undoValue;
		if (currLogo.generate.templatePath.isIconFrame === "1") {
			switch (currLogo.generate.templatePath.iconFrame.type) {
				case "center":
					if ((currLogo.generate.templatePath.iconFrame.yType === "up") && (type === 4)) {
						forceConsoleAtStaging("no need to place iconFrame at up and center");
						return;
					}
					else if ((currLogo.generate.templatePath.iconFrame.yType === "down") && (type === 0)) {
						forceConsoleAtStaging("no need to place iconFrame at down and center");
						return;
					}
					break;
				case "left":
					if (type === 1) {
						forceConsoleAtStaging("no need to place iconFrame at left");
						return;
					}
					break;
				case "right":
					if (type === 2) {
						forceConsoleAtStaging("no need to place iconFrame at right");
						return;
					}
					break;
			}
		} else {
			switch (currLogo.generate.templatePath.icon.type) {
				case "center":
					switch (currLogo.generate.templatePath.icon.yType) {
						case "up":
							if (type === 4) {
								forceConsoleAtStaging("no need to place icon at up and center");
								return;
							}
							undoValue = 4;
							break;
						case "down":
							if (type === 0) {
								forceConsoleAtStaging("no need to place icon at down and center");
								return;
							}
							undoValue = 0;
							break;
					}
					break;
				case "left":
					if (type === 1) {
						forceConsoleAtStaging("no need to place icon at left");
						return;
					}
					undoValue = 1;
					break;
				case "right":
					if (type === 2) {
						forceConsoleAtStaging("no need to place icon at right");
						return;
					}
					undoValue = 2;
					break;
			}
		}

		debugConsole("undoValue:=" + undoValue);
		debugConsole("redoValue:=" + type);

		forceConsoleAtStaging("layoutTemplate click type:=" + type);

		onSymbolePlacing(type);
	});

	function checkIconType(p_oIconObj) {
		let undoValue = 0;
		if (p_oIconObj) {
			switch (p_oIconObj.type) {
				case "center":
					switch (p_oIconObj.yType) {
						case "up":
							undoValue = 4;
							break;
						case "down":
							undoValue = 0;
							break;
					}
					break;
				case "left":
					undoValue = 1;
					break;
				case "right":
					undoValue = 2;
					break;
			}
		}
		return undoValue;
	}


	function onSymbolePlacing(type) {
		debugConsole("onSymbolePlacing: type:=" + type);
		var currLogo = getValidJsonParseObj(lEditor.getSession('currentLogo'));
		let oldLogoObj = getValidJsonParseObj(lEditor.getSession('currentLogo'));
		let isForIcon = currLogo.generate.templatePath.isIcon;
		let isForMonogram = currLogo.generate.templatePath.isMono;


		forceConsoleAtStaging("isForIcon:=" + isForIcon);
		forceConsoleAtStaging("isForMonogram:=" + isForMonogram);


		lEditor.logoTempArr = [];
		lEditor.logoSlider('final', 1);
		var logoTemp = getValidJsonParseObj(lEditor.getSession('currentLogo'));

		var isIcon = 0;
		var isMono = 0;
		var isFrame = 0;
		var isIconFrame = 0;
		var isEqual = 0;
		if (typeof logoTemp.generate.templatePath.isIcon !== "undefined") {
			isIcon = logoTemp.generate.templatePath.isIcon;
		}
		if (typeof logoTemp.generate.templatePath.isMono !== "undefined") {
			isMono = logoTemp.generate.templatePath.isMono;
		}
		if (typeof logoTemp.generate.templatePath.isFrame !== "undefined") {
			isFrame = logoTemp.generate.templatePath.isFrame;
		}
		if (typeof logoTemp.generate.templatePath.isIconFrame !== "undefined") {
			isIconFrame = logoTemp.generate.templatePath.isIconFrame;
		}
		if (typeof logoTemp.generate.templatePath.isEqual !== "undefined") {
			isEqual = logoTemp.generate.templatePath.isEqual;
		}

		var actionName = "";

		if (type === 0 || type === 1 || type === 2 || type === 3 || type === 4) {
			logoMakerFunction.resetSlider("logoSizeSlider");
			logoMakerFunction.resetSlider("iconDistanceSlider");
			logoMakerFunction.resetSlider("sloganTextSize");
			logoMakerFunction.resetSlider("sloganLetterSpacing");
			logoMakerFunction.resetSlider("textSloganDistSlider");
			logoMakerFunction.resetSlider("frameSizeSlider");
			actionName = "symbolOrMonoPlacing";
		}

		if (type == 3) {
			$('[data-option=".symbolContainer"]').text('Add Symbol');
			currLogo.monofId = "";
			currLogo.generate.iconPath = "";
			currLogo.generate.iconName = "";
			currLogo.generate.templatePath.isMono = "0";
			currLogo.generate.templatePath.isIcon = "0";
			currLogo.generate.templatePath.isIconFrame = "0";
			currLogo.iconId = "";
			isIcon = 0;
			isMono = 0;
			lEditor.setSession('currentLogo', getValidJsonStringifyObj(currLogo));
			lEditor.setSession('targetlink', 2);
			lEditor.setSession('defaultlink', 7);
			lEditor.setSession('parentlink', 'undefined');
			debugConsole("editLogoSteps8");
			lEditor.editLogoSteps();
			$('.previewSection').removeClass('hidden');
			$('.topParent-5').parent('li').removeClass('active');
			$('.symbolSection').addClass('hidden');
		} else {
		}



		forceConsoleAtStaging("isIcon:=" + isIcon);
		forceConsoleAtStaging("isMono:=" + isMono);

		var currContainerBodyObj = logoTemp.generate.templatePath.updates.containerBody;
		var isFrameExist = logoTemp.generate.templatePath.isFrame;
		var isDBLineCompanyText = "no";
		if (logoTemp.generate.templatePath.isDBLineCompanyText == "yes") {
			isDBLineCompanyText = logoTemp.generate.templatePath.isDBLineCompanyText;
		}

		var templates = getTemplatesByType(type, isIcon, isMono, isFrame, isIconFrame, isEqual, isDBLineCompanyText)[0];
		debugConsole("templates length:=" + templates.length);
		$.each(templates, function (k, v) {
			logoTemp.generate.templatePath = v;
			logoTemp.generate.templatePath.frameType = currLogo.generate.templatePath.frameType;
			logoTemp.generate.templatePath.frameOverlap = currLogo.generate.templatePath.frameOverlap;
			logoTemp.generate.templatePath.sloganSetAsPerText = currLogo.generate.templatePath.sloganSetAsPerText;
			if (currLogo.generate.templatePath.isDBLineCompanyText == "yes") {
				logoTemp.generate.templatePath.isDBLineCompanyText = currLogo.generate.templatePath.isDBLineCompanyText;
			}
			if (isFrameExist == 1) {
				logoTemp.generate.templatePath.frame_width = currLogo.generate.templatePath.frame_width;
				logoTemp.generate.templatePath.frame_height = currLogo.generate.templatePath.frame_height;
				logoTemp.generate.templatePath.frameShapeName = currLogo.generate.templatePath.frameShapeName;
				logoTemp.generate.templatePath.frmId = currLogo.generate.templatePath.frmId;
			}
			var idKey = logoMakerFunction.genRandomId();
			logoTemp.generate.idKey = idKey;
			if (type == 3) {
				logoTemp.monofId = "";
				logoTemp.generate.iconPath = "";
				logoTemp.generate.iconName = "";
				logoTemp.iconId = "";
			}
			var returnObj = null;
			if (isFrameExist == 1) {
				returnObj = logoMakerFunction.generateLogoTemplate(logoTemp.generate, idKey, null, null, null, true, actionName);
			} else {
				returnObj = logoMakerFunction.generateLogoTemplate(logoTemp.generate, idKey, null, null, null, true, actionName);
			}

			logoTemp.generate = returnObj.logoObj;
			$('.finaLogoInner').html('<div class="svg--slide" style="background-color:' + lEditor.currentLogo.generate.bgColor + ';"><div class="svg-slide--content svgSlideContent"><div class="water-mark-img"></div>' + returnObj.html + '<div class="bgOutlineBox bg-outline-box"></div></div></div>');
			currObj = updateCurrLogoObject(logoTemp);

			lEditor.setDefaultLogo(currObj, currObj.generate, function () {
				let newLogoObj = getValidJsonParseObj(lEditor.getSession('currentLogo'));;
				if (type === 3) {
					if (isForIcon == 1) {
						editorUndoRedo.setUndoActData(SYMBOL_REMOVE, oldLogoObj, newLogoObj);
					} else if (isForMonogram == 1) {
						editorUndoRedo.setUndoActData(MONOGRAM_REMOVE, oldLogoObj, newLogoObj);
					}

				} else {
					if (isForIcon == 1) {
						editorUndoRedo.setUndoActData(SYMBOL_POSITION, oldLogoObj, newLogoObj);
					} else if (isForMonogram == 1) {
						editorUndoRedo.setUndoActData(MONOGRAM_POSITION, oldLogoObj, newLogoObj);
					}
				}
			});
		});
		addEditOptions("all");
		lEditor.previewColors();
		lEditor.previewLogo();
		$('#saveIcon').trigger('click');
	}


	$('.cancelSymbol').click(function (e) {
		debugConsole("cancelSymbol click");
		if (lEditor.currentLogo.generate.templatePath.isIcon == 1) {
			lEditor.setSession('targetlink', 31);
			lEditor.setSession('parentlink', 5);
		} else {
			lEditor.setSession('targetlink', 7);
			lEditor.setSession('parentlink', 2);
			$('.symbolSection').addClass('hidden');
		}

		$('.menuSteps li').removeClass('active');
		debugConsole("editLogoSteps11");
		lEditor.editLogoSteps();
	});

	$('.cancelMono').click(function (e) {
		debugConsole("cancelMono click");
		if (lEditor.currentLogo.generate.templatePath.isMono == 1) {
			lEditor.setSession('targetlink', 32);
			lEditor.setSession('parentlink', 5);
		} else {
			lEditor.setSession('targetlink', 7);
			lEditor.setSession('parentlink', 2);
			$('.symbolSection').addClass('hidden');
		}
		$('.menuSteps li').removeClass('active');
		$(".logoSection").addClass("hidden");
		debugConsole("editLogoSteps12");
		lEditor.editLogoSteps();
	});

	$('.cancelFrameContainer').click(function (e) {
		debugConsole("cancelFrameContainer click");
		$('.containerOptions').removeClass('active');
		lEditor.setSession('targetlink', 6);
		lEditor.setSession('defaultlink', undefined);
		$('.menuSteps li').removeClass('active');
		lEditor.editLogoSteps();
	});

	$('.cancelIconFrameContainer').click(function (e) {
		debugConsole("cancelIconFrameContainer click");
		$('.innerContainerOptions').removeClass('active');
		lEditor.setSession('targetlink', 6);
		lEditor.setSession('defaultlink', undefined);
		$('.menuSteps li').removeClass('active');
		debugConsole("editLogoSteps13");
		lEditor.editLogoSteps();
	});


	// 0 => Center, 1 => Left, 2 => Right, 3 => None, 4=> Down
	function getTemplatesByType(type, isIcon, isMono, isFrame, isIconFrame, isEqual, isDBLineCompanyText) {
		debugConsole("getTemplatesByType: " + type + ",,," + isIcon + ",,," + isMono + ",,," + isFrame + ",,," + isIconFrame + ",,," + isEqual + ",,,isDBLineCompanyText:=" + isDBLineCompanyText);
		var templates = [];
		var templatesDir = [];
		var templatesId = [];
		var fetchTemplatesDataJson = [];
		if (isDBLineCompanyText == "yes") {
			fetchTemplatesDataJson = dooubleLineTemplatesDataJson;
		} else {
			fetchTemplatesDataJson = templatesDataJson;
		}

		$.each(fetchTemplatesDataJson, function (k, v) {
			if (typeof v.is_icon_frame == 'undefined' || v.is_icon_frame == null) {
				v.is_icon_frame = 0;
				debugConsole("isme aaya1");
			}
			if (type == 3) {
				isIconFrame = 0;
				// alert();
				if (v.template_direction == type && v.is_frame == isFrame && v.is_icon_frame == isIconFrame && v.is_equal == isEqual) {
					templates.push(v.template_code);
					templatesDir.push(v.template_direction);
					templatesId.push(v.template_id);
					debugConsole("isme aaya2");
				}
			} else {
				// alert(1);
				if (v.template_direction == type && v.is_icon == isIcon && v.is_mono == isMono && v.is_frame == isFrame && v.is_icon_frame == isIconFrame && v.is_equal == isEqual) {
					templates.push(v.template_code);
					templatesDir.push(v.template_direction);
					templatesId.push(v.template_id);
					// debugConsole("isme aaya3:=" + v.template_direction + ",,," + v.template_id + ",,," + JSON.stringify(v.template_code));
					debugConsole("isme aaya3:");
				} else {
					debugConsole("isme aaya11111111111111");
				}
			}
		});
		return [templates, templatesDir, templatesId];
	}

	// listing of layout variations 
	function getLayoutVariations(p_fCallBack) {
		debugConsole("getLayoutVariations:=")
		// lEditor.logoTempArr = [];
		var currLogo = getValidJsonParseObj(lEditor.getSession('currentLogo'));
		var splitLogoName = currLogo.generate.splitLogoName;
		var logoTemp = getValidJsonParseObj(lEditor.getSession('currentLogo'));
		// var currContainerBodyObj = logoTemp.generate.templatePath.updates.containerBody;
		var i = 0;
		var frames = [];
		if (loadMoreStart == 0) {
			lEditor.logoSlider('final', 1);
			lEditor.logoTempArr = [];
		}
		// $('.load--more--class').remove();
		$('.editFinalLogo').addClass('hidden');
		$('.editLogoSlider').removeClass('hidden');
		var templatesDataJsonArray = [];
		if (logoTemp.generate.templatePath.isIcon == 0 && logoTemp.generate.templatePath.isMono == 0) {
			logoTemp.generate.iconPath = '<path d="M85.141,16.424H14.858L1.46,29.821v3.686L50,83.576l2.43-2.429l0.07,0.041l0.149-0.262L97.774,34.29  l0.765-0.771v-3.698L85.141,16.424z M87.568,26.224l3.598,3.598h-7.195L87.568,26.224z M82.981,21.637l0.899,0.9l-6.412,6.414  l-7.313-7.313H82.981z M70.968,29.821H56.375l7.296-7.296L70.968,29.821z M57.187,21.637l-7.201,7.202l-7.201-7.202H57.187z   M43.596,29.821H28.969l7.314-7.313L43.596,29.821z M17.018,21.637h12.763l-7.01,7.01l-6.381-6.382L17.018,21.637z M12.703,25.95  l3.87,3.871h-7.74L12.703,25.95z M8.832,35.035h12.397l16.732,29.129L8.832,35.035z M47.392,70.116l-20.15-35.082h20.15V70.116z   M52.606,70.536V35.035h20.392L52.606,70.536z M62.594,63.615l16.415-28.581h12.174L62.594,63.615z"></path>';
		}

		debugConsole("currLogo.generate.templatePath.isIcon:=" + currLogo.generate.templatePath.isIcon);

		debugConsole("currLogo.generate.templatePath.isMono:=" + currLogo.generate.templatePath.isMono);
		debugConsole("currLogo.generate.templatePath.isIconFrame:=" + currLogo.generate.templatePath.isIconFrame);

		var isDBLineTextTemplate = false;
		// var logoText = lEditor.getSession('logoname');
		var logoTextList = lEditor.getLogoTextList(splitLogoName);
		if (logoTextList.length > 0 && logoTextList.length == 2 && (currLogo.generate.templatePath.isDBLineCompanyText == "yes")) {
			isDBLineTextTemplate = true
		}

		debugConsole("isDBLineTextTemplate:=" + isDBLineTextTemplate);
		var layoutVariationMonogramText = "";
		var fetchTemplatesDataJson = [];
		if (isDBLineTextTemplate) {
			fetchTemplatesDataJson = dooubleLineTemplatesDataJson;
		} else {
			fetchTemplatesDataJson = templatesDataJson;
		}
		if (currLogo.generate.templatePath.isIcon == 1) {
			$.each(fetchTemplatesDataJson, function (k, v) {
				if (currLogo.generate.templatePath.isIconFrame == 1) {
					if ((v.template_code.isIcon == 1) && (v.template_code.template_id != currLogo.generate.templatePath.template_id)) {
						templatesDataJsonArray.push(v);
					}
					else if ((v.template_code.isMono == 0) && (v.template_code.isIcon == 0)) {
						templatesDataJsonArray.push(v);
					}
				} else {
					if ((v.template_code.isIcon == 1) && (v.template_code.isIconFrame == 0) && (v.template_code.template_id != currLogo.generate.templatePath.template_id)) {
						templatesDataJsonArray.push(v);
					}
					else if ((v.template_code.isMono == 0) && (v.template_code.isIcon == 0)) {
						templatesDataJsonArray.push(v);
					}
				}
			});
		} else if (currLogo.generate.templatePath.isMono == 1) {
			$.each(fetchTemplatesDataJson, function (k, v) {
				if (currLogo.generate.templatePath.isIconFrame == 1) {
					if ((v.template_code.isMono == 1) && (v.template_code.template_id != currLogo.generate.templatePath.template_id)) {
						templatesDataJsonArray.push(v);
					}
					else if ((v.template_code.isMono == 0) && (v.template_code.isIcon == 0)) {
						templatesDataJsonArray.push(v);
					}
				} else {
					if ((v.template_code.isMono == 1) && (v.template_code.isIconFrame == 0) && (v.template_code.template_id != currLogo.generate.templatePath.template_id)) {
						templatesDataJsonArray.push(v);
					}
					else if ((v.template_code.isMono == 0) && (v.template_code.isIcon == 0)) {
						templatesDataJsonArray.push(v);
					}
				}
			});
		}
		else {
			layoutVariationMonogramText = lEditor.getMonogramText(true);
			$.each(fetchTemplatesDataJson, function (k, v) {
				if (v.template_code.isIcon == 1 && v.template_code.isIconFrame == 0) {
					templatesDataJsonArray.push(v);
				}
				if (v.template_code.isMono == 1 && v.template_code.isIconFrame == 0 && (currCompFontObject || currMonogramFontObject)) {
					templatesDataJsonArray.push(v);
				}
				if ((v.template_code.isMono == 0) && (v.template_code.isIcon == 0) && (v.template_code.template_id != currLogo.generate.templatePath.template_id)) {
					templatesDataJsonArray.push(v);
				}
			});
		}

		debugConsole("templatesDataJsonArray.length:=" + templatesDataJsonArray.length);

		if (templatesDataJsonArray.length > 2) {
			if ((templatesDataJsonArray.length % 2) == 1) {
				templatesDataJsonArray.pop();
				// add this condition because make 2 sets of logo
			}
		}

		var templateLength = templatesDataJsonArray.length;

		if (templateLength == 0) {
			alert("templateLength is 0");
		}
		templatesDataJsonArray = shuffleTheArray(templatesDataJsonArray);
		debugConsole("templateLength:=" + templateLength);

		debugConsole("logoTemp.generate.templatePath.isFrame:=" + logoTemp.generate.templatePath.isFrame);
		var templateIdStyle = getTempStyle();
		var templateHint = "";
		if (logoTemp.generate.templatePath.isFrame == 0) {

			jqXHR = $.ajax({
				url: DH.baseURL + '/logoMakerAjax.php',
				type: 'POST',
				data: { action: 'randomData', start: randomPagination },
				async: true,
				success: function (json) {
					var json = getValidJsonParseObj(json);
					$.each(json.data.frames, function (k, v) {
						frames.push(v);
					});
					debugConsole("loadMoreStart:=" + loadMoreStart);

					for (var i = loadMoreStart; i < templateLength;) {

						logoTemp.generate.templatePath = templatesDataJsonArray[i].template_code;

						if (logoTextList.length == 2 && logoTemp.generate.templatePath.text1 && logoTemp.generate.templatePath.text2 && logoTemp.generate.templatePath.updates.text1 && logoTemp.generate.templatePath.updates.text2) {
							logoTemp.generate.templatePath.isDBLineCompanyText = "yes";
						} else {
							logoTemp.generate.templatePath.isDBLineCompanyText = "no";
						}

						var randomFrame = logoMakerFunction.getRandomCombination([frames.length]);
						debugConsole("logoTemp.generate.templatePath isFrame:=" + logoTemp.generate.templatePath.isFrame);
						if (logoTemp.generate.templatePath.isFrame == 1) {
							logoTemp.generate.framePath = frames[randomFrame[0]].svg;
							logoTemp.generate.templatePath.frameType = frames[randomFrame[0]].type;
							logoTemp.generate.templatePath.frameOverlap = frames[randomFrame[0]].isOverlap;
							logoTemp.frmId = frames[randomFrame[0]].id;
							logoTemp.generate.templatePath.frame_width = frames[randomFrame[0]].frame_width;
							logoTemp.generate.templatePath.frame_height = frames[randomFrame[0]].frame_height;
							logoTemp.generate.templatePath.frameShapeName = frames[randomFrame[0]].shape;
							logoTemp.generate.templatePath.frmId = frames[randomFrame[0]].id;
						} else {
							logoTemp.generate.framePath = "";
							logoTemp.generate.templatePath.frameType = "";
							logoTemp.generate.templatePath.frameOverlap = "";
							logoTemp.frmId = "";
							logoTemp.generate.templatePath.frame_width = "";
							logoTemp.generate.templatePath.frame_height = "";
							logoTemp.generate.templatePath.frameShapeName = "";
							logoTemp.generate.templatePath.frmId = "";
						}

						if (logoTemp.generate.templatePath.isMono == 1 && (layoutVariationMonogramText != "")) {
							var monogramSVG = null
							if (currMonogramFontObject) {
								monogramSVG = currMonogramFontObject.getPath(layoutVariationMonogramText, 0, 0, constantVars.ORIGINAL_SPACING.monogramTextSize);
							} else {
								monogramSVG = currCompFontObject.getPath(layoutVariationMonogramText, 0, 0, constantVars.ORIGINAL_SPACING.monogramTextSize);
							}
							logoTemp.generate.iconPath = "";
							logoTemp.generate.iconPath = monogramSVG.toSVG();
						}
						var idKey = logoMakerFunction.genRandomId();
						logoTemp.generate.idKey = idKey;


						debugConsole("currLogo.generate.templatePath.sloganSetAsPerText:=" + currLogo.generate.templatePath.sloganSetAsPerText);
						logoTemp.generate.templatePath.sloganSetAsPerText = currLogo.generate.templatePath.sloganSetAsPerText;

						logoTemp.generate.templatePath.isDBLineCompanyText = currLogo.generate.templatePath.isDBLineCompanyText;


						debugConsole("logoTemp.generate.templatePath template id:=" + logoTemp.generate.templatePath.template_id);
						debugConsole("logoTemp.generate.templatePath isEqual:=" + logoTemp.generate.templatePath.isEqual);


						var returnObj = logoMakerFunction.generateLogoTemplate(logoTemp.generate, idKey, null, null, null, true, "layoutVariations");
						logoTemp.generate = returnObj.logoObj;
						lEditor.logoTempArr[i] = updateCurrLogoObject(getValidJsonParseObj(getValidJsonStringifyObj(logoTemp)));
						debugConsole("logoTemp.generate.templatePath isMono:=" + logoTemp.generate.templatePath.isMono);
						templateHint = showLogoAdminIds(logoTemp.generate.templatePath, logoTemp.sloganName, logoTemp.fId, logoTemp.cpId, logoTemp.sfId, logoTemp.frmId, logoTemp.iconFrameId, logoTemp.monofId);

						slickElement = '<div class="logos--boxes color-logo-boxes"><div class="item logo--slides logoSlides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="logoSlide-overlay gradient-div"><a href="javascript:;" class="icons-edit icons-update setDefaultLogo" data-type="color"  data-id="' + (i) + '"><span>Update to this</span></a></div><div class="svg--slide" style="background-color : ' + logoTemp.generate.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + returnObj.html + '</div></div></div></div>';
						$(".finalogoSlider").append(slickElement);
						loadMoreStart = i;
						i++;
						debugConsole("lEditor.logoTempArr11:=" + lEditor.logoTempArr.length);
						debugConsole("lEditor.logoTempArr11:=" + lEditor.logoTempArr);
						debugConsole("loadMoreStart:=" + loadMoreStart);
						debugConsole("templateLength:=" + templateLength);
						if (i % 10 == 0) {
							if ($('.load--more--class').length) {
								$('.load--more--class').remove();
							}
							$(".finalogoSlider").append('<div class="load--more--class"><a class="loadMoreVariations load--more--button" href="javascript:;"><span class="load--more-shadow"><span class="final--loader loadMoreLogosBoxes" style="display:none;"><img src="' + DH.getAssetImgUrl('logo-maker/loading.svg') + '" /></span>Load More</span></a></div>');
							if (p_fCallBack) {
								p_fCallBack();
							}
							if (loadMoreStart == templateLength - 1) {
								if ($('.load--more--class').length) {
									$('.load--more--class').remove();
								}
							}
							break;
						} else {
							if ($('.load--more--class').length) {
								$('.load--more--class').remove();
							}
							if (p_fCallBack) {
								p_fCallBack();
							}
						}
						//	}	
					}

					debugConsole("lEditor.logoTempArr:=" + lEditor.logoTempArr);
					debugConsole("lEditor.logoTempArr length:=" + lEditor.logoTempArr.length);
				}
			});
		} else {
			//	frames.push({"id":0,"svg":logoTemp.generate.framePath});
			//	debugConsole(logoTemp.generate);
			debugConsole("loadMoreStart1:=" + loadMoreStart);
			for (var i = loadMoreStart; i < templateLength;) {
				//	if(v.template_code.isIcon == 0){
				logoTemp.generate.templatePath = templatesDataJsonArray[i].template_code;
				debugConsole("logoTemp.generate.templatePath.isFrame1111111111:=" + logoTemp.generate.templatePath.isFrame);
				if (logoTemp.generate.templatePath.isFrame == 1) {
					logoTemp.generate.framePath = currLogo.generate.framePath;
					logoTemp.generate.templatePath.frameType = currLogo.generate.templatePath.frameType;
					logoTemp.frmId = currLogo.frmId;
					logoTemp.generate.templatePath.frameOverlap = currLogo.generate.templatePath.frameOverlap;
					logoTemp.generate.templatePath.frame_width = currLogo.generate.templatePath.frame_width;
					logoTemp.generate.templatePath.frame_height = currLogo.generate.templatePath.frame_height;
					logoTemp.generate.templatePath.frameShapeName = currLogo.generate.templatePath.frameShapeName;
					logoTemp.generate.templatePath.frmId = currLogo.generate.templatePath.frmId;
				} else {
					logoTemp.generate.framePath = "";
					logoTemp.generate.templatePath.frameType = "";
					logoTemp.generate.templatePath.frameOverlap = "";
					logoTemp.frmId = "";
					logoTemp.generate.templatePath.frame_width = "";
					logoTemp.generate.templatePath.frame_height = "";
					logoTemp.generate.templatePath.frameShapeName = "";
					logoTemp.generate.templatePath.frmId = "";
				}
				debugConsole("currLogo.generate.templatePath.sloganSetAsPerText11:=" + currLogo.generate.templatePath.sloganSetAsPerText);
				logoTemp.generate.templatePath.sloganSetAsPerText = currLogo.generate.templatePath.sloganSetAsPerText;
				if (currLogo.generate.templatePath.isDBLineCompanyText) {
					logoTemp.generate.templatePath.isDBLineCompanyText = currLogo.generate.templatePath.isDBLineCompanyText;
				}

				debugConsole("logoTemp.generate.templatePath template id:=" + logoTemp.generate.templatePath.template_id);
				debugConsole("logoTemp.generate.templatePath isEqual:=" + logoTemp.generate.templatePath.isEqual);

				var idKey = logoMakerFunction.genRandomId();
				logoTemp.generate.idKey = idKey;
				var returnObj = logoMakerFunction.generateLogoTemplate(logoTemp.generate, idKey, null, null, null, true, "layoutVariations");
				logoTemp.generate = returnObj.logoObj;
				lEditor.logoTempArr[i] = updateCurrLogoObject(getValidJsonParseObj(getValidJsonStringifyObj(logoTemp)));

				templateHint = showLogoAdminIds(logoTemp.generate.templatePath, logoTemp.sloganName, logoTemp.fId, logoTemp.cpId, logoTemp.sfId, logoTemp.frmId, logoTemp.iconFrameId, logoTemp.monofId);

				slickElement = '<div class="logos--boxes color-logo-boxes"><div class="item logo--slides logoSlides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="logoSlide-overlay gradient-div"><a href="javascript:;" class="icons-edit icons-update setDefaultLogo" data-type="color"  data-id="' + (i) + '"><span>Update to this</span></a></div><div class="svg--slide" style="background-color : ' + logoTemp.generate.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + returnObj.html + '</div></div></div></div>';
				$(".finalogoSlider").append(slickElement);
				loadMoreStart = i;
				i++;
				debugConsole("lEditor.logoTempArr22:=" + lEditor.logoTempArr.length);
				// debugConsole("lEditor.logoTempArr22:=", (i % 10));
				debugConsole("loadMoreStart:=" + loadMoreStart);
				debugConsole("templateLength:=" + templateLength);
				if (i % 10 == 0) {
					debugConsole("1111");
					if ($('.load--more--class').length) {
						$('.load--more--class').remove();
					}
					$(".finalogoSlider").append('<div class="load--more--class"><a class="loadMoreVariations load--more--button" href="javascript:;"><span class="load--more-shadow"><span class="final--loader loadMoreLogosBoxes" style="display:none;"><img src="' + DH.getAssetImgUrl('logo-maker/loading.svg') + '" /></span>Load More</span></a></div>');
					if (p_fCallBack) {
						p_fCallBack();
					}
					if (loadMoreStart == templateLength - 1) {
						if ($('.load--more--class').length) {
							$('.load--more--class').remove();
						}
					}
					break;
				} else {
					debugConsole("2222");
					if ($('.load--more--class').length) {
						$('.load--more--class').remove();
					}
					if (p_fCallBack) {
						p_fCallBack();
					}
				}
			}
			debugConsole("lEditor.logoTempArr1:=" + lEditor.logoTempArr);
			debugConsole("lEditor.logoTempArr1 length:=" + lEditor.logoTempArr.length);
			//	});
		}
	}
	// for step -5 ( bricks ) 
	function getIconTagListingNew() {
		debugConsole("getIconTagListingNew");
		var industryName = lEditor.getSession('extraIndustry');

		if (industryName == "") {
			industryName = 'company';
		}
		if (industryName.toLowerCase() == 'wedding service' || industryName.toLowerCase() == 'wedding-service') {
			industryName = 'wedding';
		}
		//debugger;
		industryName = getSlugNew(industryName);
		//debugger;
		var htm = '<div class="loadMoreIcons text-center"><div class="cssload-container"><div class="cssload-speeding-wheel"></div></div></div>';
		$('.start-ico-list').html(htm);
		jqXHR = $.ajax({
			url: DH.baseURL + '/dh_ajax.php',
			type: 'POST',
			data: { action: 'api', action_type: 'tags_only', 'tags_only': 1, slug: industryName },
			success: function (json) {
				json = getValidJsonParseObj(json);
				var i = 0;
				if (Object.keys(json.tags).length) {

					$.each(json.tags, function (k, v) {
						i++;
						if (v.name != "") {
							htm += '<div class="bricks"><div class="start-ico-tab startIcoTab" title="' + v.name + '" data-tag="' + v.name + '">' + v.name + '</div></div>';
						}
						if (i == 40) {
							return false;
						}
					});
				}
				if (htm != "") {
					$('.start-ico-list').html(htm);
				}
				$('.start-ico-list .loadMoreIcons').remove();
				$('.start-ico-list').removeClass('hidden');
			},
			error: function (jqXHR, textStatus, errorThrown) {
				$('#loadere').hide();
			}
		});
	};
	// for getting icon tag listing  
	// for step -5 ( bricks )        
	function getIconTagListing(industryId) {
		debugConsole("getIconTagListing");
		if (typeof industryId === 'undefined') {
			var industryId = lEditor.getSession('industryId');
		} else {
			industryId = 0;
		}

		jqXHR = $.ajax({
			url: DH.baseURL + '/logoMakerAjax.php',
			type: 'POST',
			data: { action: 'tags', industry_id: industryId },
			async: true,
			success: function (json) {
				json = getValidJsonParseObj(json);
				if (json.status == 0) {

				} else {
					var htm = '';
					var i = 0;
					$.each(json.data.tags, function (k, v) {
						i++;
						htm += '<div class="bricks"><div class="start-ico-tab startIcoTab" data-tag="' + v.icontag_tag + '">' + v.icontag_tag + '</div></div>';
						if (i == 40) {
							return false;
						}
					});
					$('.start-ico-list').removeClass('hidden');
					$('.start-ico-list').html(htm);
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				//alert(errorThrown);
			}
		});
	};
	//Added for version 2 functionality
	function getRecomIconListing() {

		debugConsole('---getRecomIconListing---');
		var industryName = lEditor.getSession('extraIndustry');
		if (industryName == "") {
			industryName = 'company';
		}
		if (industryName.toLowerCase() == 'wedding service' || industryName.toLowerCase() == 'wedding-service') {
			industryName = 'wedding';
		}
		industryName = getSlugNew(industryName);
		$('.start-ico-list').html('');
		var slug = industryName;
		var searchBtn = $('.step-holder.step_5 .logo-search-form').find('.searchIcon');
		debugConsole("iconValue 3:=" + slug);
		// lEditor.setSession('iconValue', slug);
		$('.icons-search-bar .error-text').hide();
		$('#tags').addClass('active');
		$('.icons-search-bar .error-text').hide();
		//$('#tags').focus().click().val(slug);
		$('#tags').focus().val(slug);
		lEditor.objIconSearch = "";
		//debugger;
		searchBtn.trigger('click');
	};
	function getSlugNew(str) {
		if (str != '') {
			var regex = /(&amp;|&)(.*)?/gi; //match & in between or end                                
			str = str.replace(regex, "");
		}
		return str.trim();

	}
	/*== favorite - start ==*/
	// code by Tushar
	function getFavoriteLogoListing() {
		debugConsole("getFavoriteLogoListing");
		var htm = "";
		var currLogoId = lEditor.getCurrentLogoId();

		favoritePagination++;
		if (favoritePagination == 1) {
			$('.favoriteLogo').append('<div class="loadMoreIcons common--loader text-center"><div class="cssload-container"><div class="cssload-speeding-wheel"></div></div></div>');
		}
		jqXHR = $.ajax({
			url: DH.baseURL + '/logoMakerAjax.php',
			type: 'POST',
			data: { action: 'fav_listing', start: favoritePagination },
			async: true,
			success: function (json) {
				$('.loadMoreIcons').remove();
				json = getValidJsonParseObj(json);
				if (json.status == 0) {

				} else {

					var i = 0;
					var msgBox = $('.favoriteLogoTab .no-favourite');
					$('.loadMoreFavoriteLogos').parents('.load--more--class').remove();
					if (json.data.logos.length == 0) {
						msgBox.show();
						return false;
					}
					msgBox.hide();
					$.each(json.data.logos, function (k, v) {
						var closeHtml = '';
						var defaultHtml = '';
						var activeFav = '';
						var favToolTip = 'Add to favorites';
						if (parseInt(v.logo_is_favorite) == 1) {
							activeFav = 'active';
							favToolTip = 'Remove from favorites';
						}
						if (currLogoId != v.logo_id) {
							closeHtml = '<img src="' + DH.getAssetImgUrl('logo-maker/close.svg') + '" class="removeLogo" data-id="' + v.logo_id + '">';
							defaultHtml = '<div class="logoSlide-overlay gradient-div"><a href="javascript:;" class="icons-edit icons-update openLogoDetail" data-id="' + v.logo_id + '"><span>Update to this</span></a></div>';
							dh_utility_common.changeBg();
						}
						$('.favoriteLogo').append('<div class="favoriteLogoLists saved-logo-lists" style="background-color:' + v.bg_color + '"><div class="water-mark-img"></div><div class="logo-favourite favLogoIcon ' + activeFav + '" data-placement="bottom" data-toggle="tooltip" title="" data-id="' + v.logo_id + '" data-original-title="' + favToolTip + '"><i class="icon icon-heart"></i></div>' + closeHtml + ' ' + v.logo_svg + ' ' + defaultHtml + '</div>');
						i++;
						if (json.pagination == 1 && i == json.data.logos.length) {
							$('.favoriteLogo').append('<div class="load--more--class"><a class="loadMoreFavoriteLogos load--more--button" href="javascript:;"><span class="load--more-shadow"><span class="final--loader loadMoreLogosBoxes" style="display:none;"><img src="' + DH.getAssetImgUrl('logo-maker/loading.svg') + '" /></span>Load More</span></a></div>');
						}
					});
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				//alert(errorThrown);
			}
		});

	};
	// code by Tushar        
	$('.step_6, .step_7').on('click', '.iconFav', function (e) {
		if (DH.isLogged == 0 && DH.userId == 0) {
			clearTimeout(loginPopupTimer);
			userLoginPopup();
			$('body').addClass('logo-modal-unset');
			return;
		}
		var ele = $(this);
		var fav = 1;
		var successMsg = '';
		var errMsg = '';
		var del = 0;
		var curLogoId = $(this).attr('data-logo-id');
		debugConsole("curLogoId:=" + curLogoId);
		var listType = ele.attr('data-listType');
		// listType  = "colorPallete";
		var subType = '';
		if (ele.hasClass('active')) {
			ele.removeClass('active');
			ele.attr('data-original-title', 'Add to favorites');
			fav = 0;
			del = 1;
			successMsg = 'Logo removed from your favorite list.';
			errMsg = 'Cannot remove selected logo from your favorite list.';
			if (typeof listType !== "undefined") {
				switch (listType) {
					case 'colorPallete': {
						subType = $('.colorPaletteButton.active').attr('data-id');
						if (typeof subType === 'undefined') {
							subType = $('.colorPaletteVariants a.active').attr('data-id');
						}
						logoMakerFunction.removeToFavoriteJson('colorPallete', subType, parseInt(ele.data('id')));
						break;
					}
				}
			}
		} else {
			ele.addClass('active');
			ele.attr('data-original-title', 'Remove from favorites');
			fav = 1;
			del = 0;
			successMsg = 'Logo added in your favorite list.';
			errMsg = 'Cannot add selected logo in your favorite list.';
			if (typeof listType !== "undefined") {
				switch (listType) {
					case 'colorPallete': {
						subType = 0;//$('.colorPaletteButton.active').attr('data-id');
						debugConsole("subType:=" + subType)
						if (typeof subType === 'undefined') {
							subType = $('.colorPaletteVariants').find('a.active').attr('data-id');
						}
						logoMakerFunction.addToFavoriteJson('colorPallete', subType, parseInt(ele.data('id')), curLogoId);
						break;
					}
				}
			}
		}

		// lEditor.currentLogo = {};
		debugConsole("lEditor.logoTempArr:=" + lEditor.logoTempArr + ",,," + lEditor.logoTempArr.length);
		lEditor.currentLogo = lEditor.logoTempArr[parseInt($(this).data('id'))];
		// debugConsole("lEditor.currentLogo stringify:="+JSON.stringify(lEditor.currentLogo));
		debugConsole("lEditor.currentLogo:=" + lEditor.currentLogo + ",," + typeof (lEditor.currentLogo) + ",,," + parseInt($(this).data('id')));
		var dataAnalysisObj = getDataAnalsyis(lEditor.currentLogo, false);
		jqXHR = $.ajax({
			url: DH.baseURL + '/logoMakerAjax.php',
			type: 'POST',
			beforeSend: function () {
			},
			data: { action: 'save', logo_id: curLogoId, 'curr_logo': lEditor.validateJSON(lEditor.currentLogo, dataAnalysisObj), fav: fav, del: del, 'svg_logo': logoMakerFunction.getFinalLogoTemplate(lEditor.currentLogo.generate), data_analysis: dataAnalysisObj, exceptions: JSON.stringify(createLogging("at step_6 or step_7 iconFav click")) },
			async: true,
			success: function (json) {
				json = getValidJsonParseObj(json);
				if (json.status == 0) {
					if (fav == 1) {
						ele.removeClass('active');
					} else {
						ele.addClass('active');
					}
					dh_utility_common.alert({ type: 'error', message: errMsg });
				} else {
					var retLogoId = json.data.logo_id;
					ele.attr('data-logo-id', retLogoId);
					$(".favOption .count").html(json.data.fav_count);
					ele.parents('.logo--slides').find('.iconEdit').attr('data-logo-id', retLogoId);
					if (ele.hasClass('active')) {
						debugConsole("listType:=" + listType + ",,,subType;=" + subType + ",,,data id" + parseInt(ele.data('id')) + ",,,,retLogoId:=" + retLogoId);
						if (typeof listType !== "undefined") {
							logoMakerFunction.updateLogoIdJson(listType, subType, parseInt(ele.data('id')), retLogoId);
						}
					}
					dh_utility_common.alert({ type: 'success', message: successMsg });
					$('.savedLogoCount').html('(' + json.data.saved_count + ')');
					$('.favLogoCount').html('(' + json.data.fav_count + ')');

				}
				clearException();
			},
			error: function (jqXHR, textStatus, errorThrown) {
				//alert(errorThrown);
			}

		});

	});
	// code by Tushar        
	$('.step_7').on('click', '.favLogoIcon', function (e) {
		var logoId = $(this).data('id');
		var ele = $(this);
		var favAction = 'add';
		var errMsg = 'Cannot add logo to favorite.';
		var msgBox = $('.favoriteLogoTab .no-favourite');

		if ($(this).hasClass('active')) {
			favAction = 'remove';
			errMsg = 'Cannot remove logo to favorite.';
			ele.removeClass('active');
			ele.attr('data-original-title', 'Add to favorites');
			ele.parents('.favoriteLogoLists').remove();

		} else {
			ele.addClass('active');
			ele.attr('data-original-title', 'Remove from favorites');
		}
		msgBox[$('.favoriteLogoLists.saved-logo-lists').length == 0 ? 'show' : 'hide']();
		$.ajax({
			type: "POST",
			url: DH.baseURL + '/logoMakerAjax.php',
			data: { action: 'add_remove_fav', logo_id: logoId, fav_action: favAction }
		}).done(function (retData) {
			$('#loadere').hide();
			if (retData.status == 'valid') {
				$('.savedLogoCount').html('(' + retData.saved_count + ')');
				$('.favLogoCount').html('(' + retData.favorite_count + ')');
				logoMakerFunction.removeLogoIdJson(logoId);
			} else {
				if (ele.hasClass('active')) {
					ele.removeClass('active');
				} else {
					ele.addClass('active');
				}
				dh_utility_common.alert({ type: 'error', msg: retData.msg });
			}
		}).fail(function () {

		}).always(function () {
			$('#loadere').hide();
		});
	});

	// Load the page and initialize the steps accordingly
	function initPageLoad() {
		debugConsole("initPageLoad");
		lEditor.cleanSession('defaultlink');
		//debugger;
		var crLgId = parseInt(sessionStorage.getItem('currLogoId'));
		var crPg = parseInt(sessionStorage.getItem('currPage'));
		debugConsole("crLgId:=" + crLgId);
		if (crLgId && crLgId > 0 && crPg == 7) {
			debugConsole("initPageLoad1");
			$.ajax({
				url: DH.baseURL + '/logoMakerAjax.php',
				type: 'POST',
				data: { action: 'get_logo_data', logo_id: crLgId },
				success: function (response) {
					var data = getValidJsonParseObj(response.data.logo_json);

					// //Setting loaded logo as current logo into session
					lEditor.setSession('currentLogo', response.data.logo_json);
					lEditor.setSession('logoname', data.logoName);
					lEditor.setSession('sloganText', data.sloganName);
					lEditor.cleanSession('lastTargetlink');
					lEditor.cleanSession('lastParentlink');
					$('.editSloganName').val(data.sloganName);
					eanbledSloganTool();
					debugConsole("data logoTextSlider:=" + data.generate.logoTextSlider);
					setupSliders(data);
					if (lEditor.getSession("edit_from") && lEditor.getSession("edit_from") == "favorite" || lEditor.getSession("edit_from") == "saved" || lEditor.getSession("edit_from") == "purchased") {
						lEditor.setSession('parentlink', 2);
						lEditor.setSession('targetlink', 7);
						lEditor.setSession('defaultlink', 0);
						lEditor.cleanSession("edit_from");
						debugConsole("again call showStep");
						lEditor.showStep();
					}
					editorUndoRedo.createInstance();
				}
			});
		}
		else {
			debugConsole("initPageLoad2")
			// lEditor.showStep();
		}
	}
	function eanbledSloganTool() {
		var sloganText = lEditor.getSession('sloganText');
		if (sloganText == '') {
			$('.sloganOption .companyFontCase, .sloganOption .rangeSlider').addClass('disabled');
			$('.subMenu-10, .subMenu-14').parents('li').addClass('disabled');
			$('.subMenu-9').text('Add Slogan');
			$('.removeSlogan').addClass('hidden');
			$('.textSloganDistSlider').addClass('disabled');

		} else {
			$('.sloganOption .companyFontCase, .sloganOption .rangeSlider').removeClass('disabled');
			$('.subMenu-10, .subMenu-14').parents('li').removeClass('disabled');
			$('.subMenu-9').text('Edit Slogan');
			$('.removeSlogan').removeClass('hidden');
			$('.textSloganDistSlider').removeClass('disabled');
		}
	}

	// Page load starts 
	initPageLoad();

	/*== favorite - end ==*/

	/* fix header strip */
	function headerFixed() {
		if ($(window).width() > 991) {
			var offerHeight = 0;
			if ($('.avail_offer').length > 0) {
				offerHeight = $('.avail_offer').height();
			}
			$('.lEditorHeader').css('top', offerHeight + 'px');
			$('.step-holder').css('padding-top', offerHeight + 60 + 'px');
			$('.step_6 .fix-padding').css('margin-top', '66px');
			$('#animation_box').css('padding-top', offerHeight + 20 + 'px');
		} else {
			$('.lEditorHeader').css('top', '0px');
			$('.step-holder').css('padding-top', '60px');
			$('.step_6 .fix-padding').css('margin-top', '66px');
		}
	}
	headerFixed();
	$(window).resize(function () {
		headerFixed();
	});
	/**
	 * 
	 */
	let editorUndoRedo = {
		undoRedoObj: null,

		ltsOldLogoObj: null, //logoTextSlider
		ltsNewLogoObj: null,//logoTextSlider

		llsOldLogoObj: null,//logoLetterSpacing
		llsNewLogoObj: null,//logoLetterSpacing

		stsOldLogoObj: null,//sloganTextSize
		stsNewLogoObj: null,//sloganTextSize

		slsOldLogoObj: null,//sloganLetterSpacing
		slsNewLogoObj: null,//sloganLetterSpacing

		tsdOldLogoObj: null,//textSloganDistSlider
		tsdNewLogoObj: null,//textSloganDistSlider

		lssOldLogoObj: null,//logoSizeSlider
		lssNewLogoObj: null,//logoSizeSlider

		idsOldLogoObj: null,//iconDistanceSlider
		idsNewLogoObj: null,//iconDistanceSlider

		fssOldLogoObj: null,//frameSizeSlider
		fssNewLogoObj: null,//frameSizeSlider
		/**
		  * 
		  */
		createInstance: function () {
			editorUndoRedo.createEventOnURBtns();
			editorUndoRedo.undoRedoObj = new LM_UNDO_REDO();
			editorUndoRedo.undoRedoObj.init($(".undoIcon"), $(".redoIcon"));
		},
		/**
		 * 
		 */
		createEventOnURBtns: function () {
			$(".undoIcon").bind("click", function (e) {
				e.stopImmediatePropagation();
				debugConsole("click on undo-btn");
				editorUndoRedo.doUndoAct();
				if (!$(".redoIcon").hasClass("undo_redo_btn_blink")) {
					$(".redoIcon").addClass("undo_redo_btn_blink");
				}

			});
			$(".redoIcon").bind("click", function (e) {
				e.stopImmediatePropagation();
				debugConsole("click on redo-btn");
				editorUndoRedo.doRedoAct();
			});
			$(window).keyup(function (e) {
				if (e.ctrlKey) {
					switch (e.keyCode) {
						case 90:
							debugConsole("Control Z PRESSED");
							editorUndoRedo.doUndoAct();
							break;
						case 89:
							debugConsole("Control y PRESSED");
							editorUndoRedo.doRedoAct();
							break;
					}
				}
			});
		},
		/**
		 * 
		 * @param {*} p_sActId 
		 * @param {*} p_sUndoActValue 
		 * @param {*} p_sRedoActValue 
		 */
		setUndoActData: function (p_sActId, p_sUndoActValue, p_sRedoActValue) {
			if (!$(".undoIcon").hasClass("undo_redo_btn_blink")) {
				$(".undoIcon").addClass("undo_redo_btn_blink");
			}
			debugConsole("setUndoActData p_sActId:=" + p_sActId);
			if (editorUndoRedo.undoRedoObj) {
				var undoParentLink;
				var undoTargetLink;
				var redoParentLink;
				var redoTargetLink;
				switch (p_sActId) {
					case LOGO_TEXT_CHANGE:
					case LOGO_TEXT_TRANSFORM:
					case LOGO_TEXT_FS:
					case LOGO_TEXT_LS:
						undoParentLink = 2;
						undoTargetLink = 7;
						redoParentLink = 2;
						redoTargetLink = 7;
						break;

					case LOGO_TEXT1_CHANGE:
					case LOGO_TEXT2_CHANGE:
					case LOGO_TEXT1_FS:
					case LOGO_TEXT2_FS:
					case LOGO_TEXT1_LS:
					case LOGO_TEXT2_LS:
					case LOGO_TEXT1_TRANSFORM:
					case LOGO_TEXT2_TRANSFORM:
						undoParentLink = 2;
						undoTargetLink = 7;
						redoParentLink = 2;
						redoTargetLink = 7;
						break;

					case SLOGAN_TEXT_CHANGE:
					case SLOGAN_REMOVE:
					case SLOGAN_TEXT_TRANSFORM:
					case SLOGAN_TEXT_FS:
					case SLOGAN_TEXT_LS:
					case TEXT_SLOGAN_DS:
						undoParentLink = 2;
						undoTargetLink = 9;
						redoParentLink = 2;
						redoTargetLink = 9;
						break;

					case EDIT_COLORS_BG:
						undoParentLink = 3;
						undoTargetLink = 12;
						redoParentLink = 3;
						redoTargetLink = 12;
						break;

					case EDIT_COLORS_LOGO_TEXT:
					case EDIT_COLORS_LOGO_TEXT1:
					case EDIT_COLORS_LOGO_TEXT2:
					case EDIT_GRADIENT_COLORS_LOGO_TEXT:
					case EDIT_GRADIENT_COLORS_LOGO_TEXT1:
					case EDIT_GRADIENT_COLORS_LOGO_TEXT2:
						undoParentLink = 3;
						undoTargetLink = 13;
						redoParentLink = 3;
						redoTargetLink = 13;
						break;

					case EDIT_COLORS_SLOGAN_TEXT:
					case EDIT_GRADIENT_COLORS_SLOGAN_TEXT:
						undoParentLink = 3;
						undoTargetLink = 14;
						redoParentLink = 3;
						redoTargetLink = 14;
						break;

					case EDIT_COLORS_SYMBOL:
					case EDIT_GRADIENT_COLORS_SYMBOL:
						undoParentLink = 3;
						undoTargetLink = 15;
						redoParentLink = 3;
						redoTargetLink = 15;
						break;

					case EDIT_COLORS_INNER_CONTAINER:
					case EDIT_GRADIENT_COLORS_INNER_CONTAINER:
						undoParentLink = 3;
						undoTargetLink = 43;
						redoParentLink = 3;
						redoTargetLink = 43;
						break;

					case EDIT_COLORS_OUTER_CONTAINER:
					case EDIT_GRADIENT_COLORS_OUTER_CONTAINER:
						undoParentLink = 3;
						undoTargetLink = 16;
						redoParentLink = 3;
						redoTargetLink = 16;
						break;

					case SYMBOL_ADD:
						undoParentLink = "undefined"
						undoTargetLink = 5;
						redoParentLink = 5;
						redoTargetLink = 31;
						break;

					case SYMBOL_REMOVE:
						undoParentLink = 5;
						undoTargetLink = 31;
						redoParentLink = 2;
						redoTargetLink = 7;
						break;

					case SYMBOL_POSITION:
					case SYMBOL_SIZE:
					case SYMBOL_DS:
					case SYMBOL_CHANGE:
						undoParentLink = 5;
						undoTargetLink = 31;
						redoParentLink = 5;
						redoTargetLink = 31;
						break;


					case MONOGRAM_ADD:
						undoParentLink = "undefined"
						undoTargetLink = 5;
						redoParentLink = 5;
						redoTargetLink = 32;
						break;

					case MONOGRAM_REMOVE:
						undoParentLink = 5;
						undoTargetLink = 32;
						redoParentLink = 2;
						redoTargetLink = 7;
						break;

					case MONOGRAM_POSITION:
					case MONOGRAM_SIZE:
					case MONOGRAM_DS:
					case MONOGRAM_CHANGE:
						undoParentLink = 5;
						undoTargetLink = 32;
						redoParentLink = 5;
						redoTargetLink = 32;
						break;

					case OUTER_CONTAINER_ADD:
						undoParentLink = lEditor.getSession("lastParentlink");
						undoTargetLink = lEditor.getSession("lastTargetlink");
						redoParentLink = 6;
						redoTargetLink = 24;
						break;

					case OUTER_CONTAINER_REMOVE:
						undoParentLink = 6;
						undoTargetLink = 24;
						redoParentLink = "undefined"
						redoTargetLink = 6;
						break;

					case OUTER_CONTAINER_SIZE:
					case OUTER_CONTAINER_CHANGE:
						undoParentLink = 6;
						undoTargetLink = 24;
						redoParentLink = 6;
						redoTargetLink = 24;
						break;

					case INNER_CONTAINER_ADD:
						undoParentLink = "undefined";
						undoTargetLink = 6;
						redoParentLink = 6;
						redoTargetLink = 40;
						break;

					case INNER_CONTAINER_REMOVE:
						undoParentLink = 6;
						undoTargetLink = 40;
						redoParentLink = "undefined"
						redoTargetLink = 6;
						break;

					case INNER_CONTAINER_CHANGE:
						undoParentLink = 6;
						undoTargetLink = 40;
						redoParentLink = 6;
						redoTargetLink = 40;
						break;

					case SLOGAN_FONT_CHANGE:
						undoParentLink = 2;
						undoTargetLink = 9;
						redoParentLink = 2;
						redoTargetLink = 9;
						break;

					case LOGO_FONT_CHANGE:
					case LOGO_FONT1_CHANGE:
					case LOGO_FONT2_CHANGE:
					case EDIT_COLORS_VARIATIONS:
					case LAYOUT_VARIATIONS:
					case GENERATE_MORE_LOGOS:
						undoParentLink = lEditor.getSession("lastParentlink");
						undoTargetLink = lEditor.getSession("lastTargetlink");
						redoParentLink = 2;
						redoTargetLink = 7;
						break;
				}

				if ((typeof (p_sUndoActValue) === "string") && (typeof (p_sRedoActValue) === "string")) {
					if (removeMultipleSpaces(p_sUndoActValue) === removeMultipleSpaces(p_sRedoActValue)) {
						debugConsole("both string are same:=" + p_sUndoActValue + ",,," + p_sUndoActValue.trim() + ",,," + p_sRedoActValue + ",,," + p_sRedoActValue.trim());
					} else {
						debugConsole("typeof is string");
						editorUndoRedo.undoRedoObj.setUndoAct(p_sActId, p_sUndoActValue, undoParentLink, undoTargetLink, p_sRedoActValue, redoParentLink, redoTargetLink);
					}
				}
				else if ((typeof (p_sUndoActValue) === "object") && (typeof (p_sRedoActValue) === "object")) {
					switch (p_sActId) {
						case MONOGRAM_CHANGE:
							debugConsole("p_sUndoActValue.fontName:=" + p_sUndoActValue.generate.fontName);
							debugConsole("p_sRedoActValue.fontName:=" + p_sRedoActValue.generate.fontName);
							if (p_sUndoActValue.generate.fontName === p_sRedoActValue.generate.fontName) {
								debugConsole("no need to change for " + MONOGRAM_CHANGE + " because both fontName is same");
								return;
							}
							break;
						case LOGO_FONT_CHANGE:
						case LOGO_FONT1_CHANGE:
							debugConsole("p_sUndoActValue.textFontType:=" + p_sUndoActValue.generate.textFontType);
							debugConsole("p_sRedoActValue.textFontType:=" + p_sRedoActValue.generate.textFontType);
							if (p_sUndoActValue.generate.textFontType === p_sRedoActValue.generate.textFontType) {
								debugConsole("no need to change for " + p_sActId + " because both textFontType is same");
								return;
							}
							break;
						case LOGO_FONT2_CHANGE:
							debugConsole("p_sUndoActValue.text2FontType:=" + p_sUndoActValue.generate.text2FontType);
							debugConsole("p_sRedoActValue.text2FontType:=" + p_sRedoActValue.generate.text2FontType);
							if (p_sUndoActValue.generate.text2FontType === p_sRedoActValue.generate.text2FontType) {
								debugConsole("no need to change for " + p_sActId + " because both text2FontType is same");
								return;
							}
							break;
						case SLOGAN_FONT_CHANGE:
							debugConsole("p_sUndoActValue.sloganFontType:=" + p_sUndoActValue.generate.sloganFontType);
							debugConsole("p_sRedoActValue.sloganFontType:=" + p_sRedoActValue.generate.sloganFontType);
							if (p_sUndoActValue.generate.sloganFontType === p_sRedoActValue.generate.sloganFontType) {
								debugConsole("no need to change for " + SLOGAN_FONT_CHANGE + " because both sloganFontType is same");
								return;
							}
							break;
					}

					if ((p_sActId == MONOGRAM_SIZE) || (p_sActId == SYMBOL_SIZE)) {
						debugConsole("p_sUndoActValue:=" + p_sUndoActValue.generate.iconDistanceSlider);
						debugConsole("p_sRedoActValue:=" + p_sRedoActValue.generate.iconDistanceSlider);
						editorUndoRedo.undoRedoObj.setUndoAct(p_sActId, p_sUndoActValue, undoParentLink, undoTargetLink, p_sRedoActValue, redoParentLink, redoTargetLink, p_sUndoActValue.generate.iconDistanceSlider, p_sRedoActValue.generate.iconDistanceSlider);
					} else {
						editorUndoRedo.undoRedoObj.setUndoAct(p_sActId, p_sUndoActValue, undoParentLink, undoTargetLink, p_sRedoActValue, redoParentLink, redoTargetLink);
					}

				}
				else {
					if (p_sUndoActValue == p_sRedoActValue) {
						debugConsole("both are same:=" + p_sUndoActValue + ",,," + p_sRedoActValue);
					} else {
						editorUndoRedo.undoRedoObj.setUndoAct(p_sActId, p_sUndoActValue, undoParentLink, undoTargetLink, p_sRedoActValue, redoParentLink, redoTargetLink);
					}
				}
			}
		},
		/**
		 * 
		 */
		doUndoAct: function () {
			hideAllPopover();
			if (editorUndoRedo.undoRedoObj) {
				let currentUndoObj = editorUndoRedo.undoRedoObj.getCurrentUndoAct();
				if (currentUndoObj && currentUndoObj.type) {
					editorUndoRedo.showBlocker(true);
					// debugConsole("currentUndoObj:="+JSON.stringify(currentUndoObj));
					debugConsole("doUndoAct currentUndoObj.type:=" + currentUndoObj.type);
					debugConsole("doUndoAct currentUndoObj.uniqId:=" + currentUndoObj.uniqId);
					debugConsole("doUndoAct currentUndoObj.undoValue:=" + currentUndoObj.undoValue);
					debugConsole("doUndoAct currentUndoObj.undoParentLink:=" + currentUndoObj.undoParentLink);
					debugConsole("doUndoAct currentUndoObj.undoTargetLink:=" + currentUndoObj.undoTargetLink);
					debugConsole("doUndoAct currentUndoObj.hackedUndoValue:=" + currentUndoObj.hackedUndoValue);
					switch (currentUndoObj.type) {
						// Logo name 
						case LOGO_TEXT_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							$('.editCompanyName').val(currentUndoObj.undoValue);
							onLogoNameTextInput("undo_redo_logoName");
							break;

						case LOGO_TEXT1_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							onLogoNameTextInput("undo_redo_logoName1", currentUndoObj.undoValue);
							break;

						case LOGO_TEXT2_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							onLogoNameTextInput("undo_redo_logoName2", currentUndoObj.undoValue);
							break;
						case LOGO_TEXT_TRANSFORM:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, LOGO_TEXT_TRANSFORM);
							break;
						case LOGO_TEXT1_TRANSFORM:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, LOGO_TEXT1_TRANSFORM);
							break;
						case LOGO_TEXT2_TRANSFORM:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, LOGO_TEXT2_TRANSFORM);
							break;
						case LOGO_TEXT_FS:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, LOGO_TEXT_FS);
							break;
						case LOGO_TEXT1_FS:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, LOGO_TEXT1_FS);
							break;
						case LOGO_TEXT2_FS:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, LOGO_TEXT2_FS);
							break;
						case LOGO_TEXT_LS:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, LOGO_TEXT_LS);
							break;
						case LOGO_TEXT1_LS:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, LOGO_TEXT1_LS);
							break;
						case LOGO_TEXT2_LS:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, LOGO_TEXT2_LS);
							break;

						case LOGO_FONT_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, currentUndoObj.prevAct, LOGO_FONT_CHANGE);
							break;

						case LOGO_FONT1_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, LOGO_FONT1_CHANGE);
							break;

						case LOGO_FONT2_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, LOGO_FONT2_CHANGE);
							break;

						// Slogan
						case SLOGAN_TEXT_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							$('.editSloganName').val(currentUndoObj.undoValue);
							onLogoNameTextInput("undo_redo_slogan");
							break;
						case SLOGAN_REMOVE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, SLOGAN_REMOVE);
							break;
						case SLOGAN_TEXT_TRANSFORM:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, SLOGAN_TEXT_TRANSFORM);
							break;
						case SLOGAN_TEXT_FS:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, SLOGAN_TEXT_FS);
							break;
						case SLOGAN_TEXT_LS:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);

							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, SLOGAN_TEXT_LS);
							break;
						case TEXT_SLOGAN_DS:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, TEXT_SLOGAN_DS);
							break;
						case SLOGAN_FONT_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, SLOGAN_FONT_CHANGE);
							break;

						// Symbol
						case SYMBOL_ADD:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, SYMBOL_ADD);
							break;
						case SYMBOL_REMOVE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, SYMBOL_REMOVE);
							break;
						case SYMBOL_POSITION:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, SYMBOL_POSITION);
							break;
						case SYMBOL_SIZE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, SYMBOL_SIZE, currentUndoObj.hackedUndoValue);
							break;
						case SYMBOL_DS:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, SYMBOL_DS);
							break;
						case SYMBOL_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, SYMBOL_CHANGE);
							break;

						// Monogram
						case MONOGRAM_ADD:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, MONOGRAM_ADD);
							break;
						case MONOGRAM_REMOVE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, MONOGRAM_REMOVE);
							break;
						case MONOGRAM_POSITION:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, MONOGRAM_POSITION);
							break;
						case MONOGRAM_SIZE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, MONOGRAM_SIZE, currentUndoObj.hackedUndoValue);
							break;
						case MONOGRAM_DS:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, MONOGRAM_DS);
							break;
						case MONOGRAM_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, MONOGRAM_CHANGE);
							break;

						// Outer container
						case OUTER_CONTAINER_ADD:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, OUTER_CONTAINER_ADD);
							break;
						case OUTER_CONTAINER_REMOVE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, OUTER_CONTAINER_REMOVE);
							break;
						case OUTER_CONTAINER_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, OUTER_CONTAINER_CHANGE);
							break;
						case OUTER_CONTAINER_SIZE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, OUTER_CONTAINER_SIZE);
							break;

						// Inner container
						case INNER_CONTAINER_ADD:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, INNER_CONTAINER_ADD);
							break;
						case INNER_CONTAINER_REMOVE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, INNER_CONTAINER_REMOVE);
							break;
						case INNER_CONTAINER_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, INNER_CONTAINER_CHANGE);
							break;

						// Edit colors
						case EDIT_COLORS_BG:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, EDIT_COLORS_BG);
							break;

						case EDIT_COLORS_LOGO_TEXT:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, EDIT_COLORS_LOGO_TEXT);
							break;
						case EDIT_COLORS_LOGO_TEXT1:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, EDIT_COLORS_LOGO_TEXT1);
							break;
						case EDIT_COLORS_LOGO_TEXT2:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, EDIT_COLORS_LOGO_TEXT2);
							break;
						case EDIT_GRADIENT_COLORS_LOGO_TEXT:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, EDIT_GRADIENT_COLORS_LOGO_TEXT);
							break;
						case EDIT_GRADIENT_COLORS_LOGO_TEXT1:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, EDIT_GRADIENT_COLORS_LOGO_TEXT1);
							break;
						case EDIT_GRADIENT_COLORS_LOGO_TEXT2:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, EDIT_GRADIENT_COLORS_LOGO_TEXT2);
							break;

						case EDIT_COLORS_SLOGAN_TEXT:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, EDIT_COLORS_SLOGAN_TEXT);
							break;
						case EDIT_GRADIENT_COLORS_SLOGAN_TEXT:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, EDIT_GRADIENT_COLORS_SLOGAN_TEXT);
							break;

						case EDIT_COLORS_SYMBOL:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, EDIT_COLORS_SYMBOL);
							break;
						case EDIT_GRADIENT_COLORS_SYMBOL:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, EDIT_GRADIENT_COLORS_SYMBOL);
							break;

						case EDIT_COLORS_INNER_CONTAINER:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, EDIT_COLORS_INNER_CONTAINER);
							break;
						case EDIT_GRADIENT_COLORS_INNER_CONTAINER:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, EDIT_GRADIENT_COLORS_INNER_CONTAINER);
							break;

						case EDIT_COLORS_OUTER_CONTAINER:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, EDIT_COLORS_OUTER_CONTAINER);
							break;
						case EDIT_GRADIENT_COLORS_OUTER_CONTAINER:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, EDIT_GRADIENT_COLORS_OUTER_CONTAINER);
							break;

						case EDIT_COLORS_VARIATIONS:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, EDIT_COLORS_VARIATIONS);
							break;
						//--------------------------
						case LAYOUT_VARIATIONS:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, LAYOUT_VARIATIONS);
							break;
						//--------------------------
						case GENERATE_MORE_LOGOS:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, GENERATE_MORE_LOGOS);
							break;
					}
				} else {
					debugConsole("no undo act available");
				}
			}
		},
		/**
		 * 
		 */
		doRedoAct: function () {
			hideAllPopover();
			if (editorUndoRedo.undoRedoObj) {
				let currentRedoObj = editorUndoRedo.undoRedoObj.getCurrentRedoAct();
				if (currentRedoObj && currentRedoObj.type) {
					editorUndoRedo.showBlocker(true);
					debugConsole("doRedoAct currentRedoObj.type:=" + currentRedoObj.type);
					debugConsole("doRedoAct currentRedoObj.uniqId:=" + currentRedoObj.uniqId);
					debugConsole("doRedoAct currentRedoObj.redoValue:=" + currentRedoObj.redoValue);
					debugConsole("doRedoAct currentRedoObj.redoParentLink:=" + currentRedoObj.redoParentLink);
					debugConsole("doRedoAct currentRedoObj.redoTargetLink:=" + currentRedoObj.redoTargetLink);
					debugConsole("doRedoAct currentRedoObj.hackedRedoValue:=" + currentRedoObj.hackedRedoValue);
					switch (currentRedoObj.type) {
						// Logo name
						case LOGO_TEXT_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							$('.editCompanyName').val(currentRedoObj.redoValue);
							onLogoNameTextInput("undo_redo_logoName");
							break;
						case LOGO_TEXT1_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							onLogoNameTextInput("undo_redo_logoName1", currentRedoObj.redoValue);
							break;
						case LOGO_TEXT2_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							onLogoNameTextInput("undo_redo_logoName2", currentRedoObj.redoValue);
							break;
						case LOGO_TEXT_TRANSFORM:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", LOGO_TEXT_TRANSFORM);
							break;
						case LOGO_TEXT1_TRANSFORM:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", LOGO_TEXT1_TRANSFORM);
							break;
						case LOGO_TEXT2_TRANSFORM:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", LOGO_TEXT2_TRANSFORM);
							break;
						case LOGO_TEXT_FS:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", LOGO_TEXT_FS);
							break;
						case LOGO_TEXT1_FS:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", LOGO_TEXT1_FS);
							break;
						case LOGO_TEXT2_FS:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", LOGO_TEXT2_FS);
							break;
						case LOGO_TEXT_LS:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", LOGO_TEXT_LS);
							break;
						case LOGO_TEXT1_LS:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", LOGO_TEXT1_LS);
							break;
						case LOGO_TEXT2_LS:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", LOGO_TEXT2_LS);
							break;
						case LOGO_FONT_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", LOGO_FONT_CHANGE);
							break;
						case LOGO_FONT1_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", LOGO_FONT1_CHANGE);
							break;
						case LOGO_FONT2_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", LOGO_FONT2_CHANGE);
							break;

						// Slogan
						case SLOGAN_TEXT_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							$('.editSloganName').val(currentRedoObj.redoValue);
							onLogoNameTextInput("undo_redo_slogan");
							break;
						case SLOGAN_REMOVE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", SLOGAN_REMOVE);
							break;
						case SLOGAN_TEXT_TRANSFORM:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", SLOGAN_TEXT_TRANSFORM);
							break;
						case SLOGAN_TEXT_FS:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", SLOGAN_TEXT_FS);
							break;
						case SLOGAN_TEXT_LS:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);

							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", SLOGAN_TEXT_LS);
							break;
						case TEXT_SLOGAN_DS:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", TEXT_SLOGAN_DS);
							break;
						case SLOGAN_FONT_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", SLOGAN_FONT_CHANGE);
							break;

						// Symbol
						case SYMBOL_ADD:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", SYMBOL_ADD);
							break;
						case SYMBOL_REMOVE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", SYMBOL_REMOVE);
							break;
						case SYMBOL_POSITION:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", SYMBOL_POSITION);
							break;
						case SYMBOL_SIZE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", SYMBOL_SIZE, currentRedoObj.hackedRedoValue);
							break;
						case SYMBOL_DS:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", SYMBOL_DS);
							break;
						case SYMBOL_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", SYMBOL_CHANGE);
							break;

						// Monogram
						case MONOGRAM_ADD:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", MONOGRAM_ADD);
							break;
						case MONOGRAM_REMOVE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", MONOGRAM_REMOVE);
							break;
						case MONOGRAM_POSITION:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", MONOGRAM_POSITION);
							break;
						case MONOGRAM_SIZE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", MONOGRAM_SIZE, currentRedoObj.hackedRedoValue);
							break;
						case MONOGRAM_DS:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", MONOGRAM_DS);
							break;
						case MONOGRAM_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", MONOGRAM_CHANGE);
							break;

						// Outer container
						case OUTER_CONTAINER_ADD:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", OUTER_CONTAINER_ADD);
							break;
						case OUTER_CONTAINER_REMOVE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", OUTER_CONTAINER_REMOVE);
							break;
						case OUTER_CONTAINER_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", OUTER_CONTAINER_CHANGE);
							break;
						case OUTER_CONTAINER_SIZE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", OUTER_CONTAINER_SIZE);
							break;

						// Inner container
						case INNER_CONTAINER_ADD:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", INNER_CONTAINER_ADD);
							break;
						case INNER_CONTAINER_REMOVE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", INNER_CONTAINER_REMOVE);
							break;
						case INNER_CONTAINER_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", INNER_CONTAINER_CHANGE);
							break;

						// Edit colors
						case EDIT_COLORS_BG:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", EDIT_COLORS_BG);
							break;

						case EDIT_COLORS_LOGO_TEXT:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", EDIT_COLORS_LOGO_TEXT);
							break;
						case EDIT_COLORS_LOGO_TEXT1:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", EDIT_COLORS_LOGO_TEXT1);
							break;
						case EDIT_COLORS_LOGO_TEXT2:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", EDIT_COLORS_LOGO_TEXT2);
							break;
						case EDIT_GRADIENT_COLORS_LOGO_TEXT:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", EDIT_GRADIENT_COLORS_LOGO_TEXT);
							break;
						case EDIT_GRADIENT_COLORS_LOGO_TEXT1:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", EDIT_GRADIENT_COLORS_LOGO_TEXT1);
							break;
						case EDIT_GRADIENT_COLORS_LOGO_TEXT2:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", EDIT_GRADIENT_COLORS_LOGO_TEXT2);
							break;

						case EDIT_COLORS_SLOGAN_TEXT:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", EDIT_COLORS_SLOGAN_TEXT);
							break;
						case EDIT_GRADIENT_COLORS_SLOGAN_TEXT:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", EDIT_COLORS_SLOGAN_TEXT);
							break;

						case EDIT_COLORS_SYMBOL:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", EDIT_COLORS_SYMBOL);
							break;
						case EDIT_GRADIENT_COLORS_SYMBOL:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", EDIT_GRADIENT_COLORS_SYMBOL);
							break;

						case EDIT_COLORS_INNER_CONTAINER:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", EDIT_COLORS_INNER_CONTAINER);
							break;
						case EDIT_GRADIENT_COLORS_INNER_CONTAINER:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", EDIT_GRADIENT_COLORS_INNER_CONTAINER);
							break;

						case EDIT_COLORS_OUTER_CONTAINER:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", EDIT_COLORS_OUTER_CONTAINER);
							break;
						case EDIT_GRADIENT_COLORS_OUTER_CONTAINER:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", EDIT_GRADIENT_COLORS_OUTER_CONTAINER);
							break;

						case EDIT_COLORS_VARIATIONS:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", EDIT_COLORS_VARIATIONS);
							break;
						//-------------------
						case LAYOUT_VARIATIONS:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", LAYOUT_VARIATIONS);
							break;
						//-------------------
						case GENERATE_MORE_LOGOS:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", GENERATE_MORE_LOGOS);
							break;
					}
				} else {
					debugConsole("no redo act available");
				}
			}
		},
		/**
		 * 
		 * @param {*} p_nParentLink 
		 * @param {*} p_nTargetlink 
		 * @param {*} p_oUndoRedoObj 
		 */
		showTopMenuTabs: function (p_nParentLink, p_nTargetlink, p_oUndoRedoObj) {
			$('.previewSection').removeClass('hidden');
			$('.editFinalLogo').removeClass('hidden');
			$('.editLogoSlider').addClass('hidden');
			debugConsole("showTopMenuTabs p_nParentLink:=" + p_nParentLink + ",,p_nTargetlink:=" + p_nTargetlink + ",,," + p_oUndoRedoObj);

			if (p_nParentLink != "undefined" || p_nTargetlink != "undefined") {
				if (p_nParentLink == "undefined" && p_nTargetlink == 30) {
					p_nParentLink = 2;
					p_nTargetlink = 7;
					// generate more logos case
				}
				else if (p_nParentLink == "undefined" && p_nTargetlink == 29) {
					p_nParentLink = 2;
					p_nTargetlink = 7;
					// layout variations case
				}
				else if (p_nParentLink == 5 && p_nTargetlink == 31) {
					if (p_oUndoRedoObj.generate.templatePath.isIcon == 1) {
					} else {
						p_nTargetlink = undefined;
					}
					// add or search symbol case
				}
				else if (p_nParentLink == 5 && p_nTargetlink == 32) {
					if (p_oUndoRedoObj.generate.templatePath.isMono == 1) {
					} else {
						p_nTargetlink = undefined;
					}
					// add or search monogram case
				}
				else if (p_nParentLink == 6 && p_nTargetlink == 24) {
					if (p_oUndoRedoObj.generate.templatePath.isFrame == 1) {
					} else {
						p_nTargetlink = undefined;
					}
					// add outer container case
				}
				else if (p_nParentLink == 6 && p_nTargetlink == 40) {
					if (p_oUndoRedoObj.generate.templatePath.isIconFrame == 1) {
					} else {
						p_nTargetlink = undefined;
					}
					// add inner container case
				}
				else if (p_nParentLink == 2 && p_nTargetlink == 8) {
					p_nTargetlink = undefined;
					// change compnay name fonts case
				}
				else if (p_nParentLink == 2 && p_nTargetlink == 10) {
					p_nTargetlink = undefined;
					// change slogan fonts case
				}
				else if (p_nParentLink == 3 && p_nTargetlink == 26) {
					p_nTargetlink = undefined;
					// color variations case
				}
				else if (p_nParentLink == 2 && p_nTargetlink == 2) {
					p_nTargetlink = 7;
				}
				else if (p_nParentLink == "undefined" && p_nTargetlink == 2) {
					p_nParentLink = p_nTargetlink;
					p_nTargetlink = 7;
					// edit name and slogan case
				}
				else if (p_nParentLink == "undefined" && p_nTargetlink == 3) {
					p_nParentLink = p_nTargetlink;
					p_nTargetlink = 12;
					// edit colors case
				}
				else if (p_nParentLink == "undefined" && p_nTargetlink != "undefined") {
					p_nParentLink = p_nTargetlink;
					p_nTargetlink = undefined;
				}
				else if (p_nParentLink != "undefined" && p_nTargetlink == "undefined") {
					// alert("not possible case");
				}
			} else {
				p_nParentLink = 2;
				p_nTargetlink = 7;
			}
			debugConsole("showTopMenuTabs after p_nParentLink:=" + p_nParentLink + ",,p_nTargetlink:=" + p_nTargetlink);

			if (p_nParentLink == null && p_nTargetlink == null) {
				p_nParentLink = 2;
				p_nTargetlink = 7;
			}


			lEditor.setSession("parentlink", p_nParentLink);
			lEditor.setSession("targetlink", p_nTargetlink);
			lEditor.setSession("defaultlink", undefined);

			var parentDiv = $('.subChild-13').find(".company-text-color-box");
			parentDiv.addClass("hidden");

			let parentClass = ".topParent-" + p_nParentLink;
			debugConsole("parentClass:=" + parentClass);
			let menu1Div = $(".menu_1").find(parentClass);
			if (menu1Div) {
				$(".menu_1").find('[class^="topParent"]').parent('li').removeClass('active');
				menu1Div.parent('li').addClass('active');
				// top menu end here
				let menu2Div = $(".menu_2").find('.subMenuSection');
				if (menu2Div) {
					menu2Div.find('[class^="submenu"]').addClass('hidden');
					let menu2_submenu_class = ".submenu_" + p_nParentLink;
					debugConsole("menu2_submenu_class:=" + menu2_submenu_class);
					let menu2_submenu_div = menu2Div.find(menu2_submenu_class);
					if (menu2_submenu_div) {
						menu2_submenu_div.removeClass('hidden');
					}

					let menu2_submenu_subnav_div = menu2_submenu_div.find(".subnav");
					if (menu2_submenu_subnav_div) {
						menu2_submenu_subnav_div.find('[class^="subMenu"]').parent('li').removeClass('active');
						let menu2_submenu_subnav_subMenu_class = ".subMenu-" + p_nTargetlink;
						debugConsole("menu2_submenu_subnav_subMenu_class:=" + menu2_submenu_subnav_subMenu_class);
						let menu2_submenu_subnav_subMenu_div = menu2_submenu_subnav_div.find(menu2_submenu_subnav_subMenu_class);
						if (menu2_submenu_subnav_subMenu_div) {
							menu2_submenu_subnav_subMenu_div.parent('li').addClass('active');
						}
					}
					let menu2_submenu_logo_edit_option_div = menu2_submenu_div.find(".logo-edit--option");
					menu2_submenu_logo_edit_option_div.find('[class^="subChild"]').addClass('hidden');

					let menu2_logo_edit_option_div = menu2Div.find(".logo-edit--option");
					menu2_logo_edit_option_div.find('[class^="subChild"]').addClass('hidden');

					if (p_nParentLink == 2 || p_nParentLink == 5 || p_nParentLink == 6) {
						let menu2_submenu_logo_edit_option_subchild_class = ".subChild-" + p_nTargetlink;
						debugConsole("menu2_submenu_logo_edit_option_subchild_class:=" + menu2_submenu_logo_edit_option_subchild_class);
						let menu2_submenu_logo_edit_option_subchild_div = menu2_submenu_logo_edit_option_div.find(menu2_submenu_logo_edit_option_subchild_class);
						if (menu2_submenu_logo_edit_option_subchild_div) {
							menu2_submenu_logo_edit_option_subchild_div.removeClass('hidden');
						}
					} else if (p_nParentLink == 3) {
						let menu2_logo_edit_option_subchild_class = ".subChild-" + p_nTargetlink;
						debugConsole("menu2_logo_edit_option_subchild_class:=" + menu2_logo_edit_option_subchild_class);
						let menu2_logo_edit_option_subchild_div = menu2_logo_edit_option_div.find(".logo--inner").find(menu2_logo_edit_option_subchild_class);
						debugConsole(menu2_logo_edit_option_subchild_div.attr("class") + ",,," + menu2_logo_edit_option_subchild_div);
						if (menu2_logo_edit_option_subchild_div) {
							menu2_logo_edit_option_subchild_div.removeClass('hidden');
						}
					}
					lEditor.showMultiLineTextTools(p_oUndoRedoObj);
				}
			}
		},
		/**
		 * 
		 * @param {*} p_sType 
		 */
		showTopMenuEditTabs: function (p_sType, p_oUndoRedoobj) {
			debugConsole("showTopMenuEditTabs p_sType:=" + p_sType);
			switch (p_sType) {

				case "icon_yes":
					$('.layoutDisplay, .editSymbolsSection').removeClass('hidden');
					$('.layoutDisplay').removeClass('active');
					$('.symbolVariations').addClass('hidden');
					$('[data-option=".symbolContainer"]').text('Edit Symbol');
					$('[data-option=".symbolVariations"]').text('Change Symbol');
					$('.iconDistanceSlider, .iconVsTextSlider, .logoSizeSlider').removeClass('disabled');
					break;
				case "icon_no":
					$('.layoutDisplay, .editSymbolsSection').addClass('hidden');
					$('.symbolVariations').removeClass('hidden');
					$('[data-option=".symbolContainer"]').text('Add Symbol');
					$('.iconDistanceSlider, .iconVsTextSlider, .logoSizeSlider').addClass('disabled');
					break;

				case "mono_yes":
					$('.layoutDisplay, .editMonoSection').removeClass('hidden');
					$('.layoutDisplay').removeClass('active');
					$('.monoVariations').addClass('hidden');
					$('[data-option=".monogramContainer"]').text('Edit Monogram');
					$('[data-option=".monoVariations"]').text('Change Monogram');
					$('.iconDistanceSlider, .iconVsTextSlider, .logoSizeSlider').removeClass('disabled');
					break;
				case "mono_no":
					$('.layoutDisplay, .editMonoSection').addClass('hidden');
					$('.monoVariations').removeClass('hidden');
					$('[data-option=".monogramContainer"]').text('Add Monogram');
					$('.iconDistanceSlider, .iconVsTextSlider, .logoSizeSlider').addClass('disabled');
					break;

				case "outer_frame_yes":
					$('.subMenu-23').parent('li').removeClass('hidden');
					$('.subMenu-23').parent('li').removeClass('active');
					$('.subMenu-42').parent('li').removeClass('active');
					$('.subMenu-42').parent('li').removeClass('hidden');
					$('.subMenu-42').parents('ul').addClass('flex');
					$('.subMenu-24').text('Edit Outer Container');
					$(".containerOptions").removeClass('active');
					$('.cancelFrameContainer').parent('li').addClass('hidden');
					$('.containerFrameSlider').removeClass('hidden');
					$('.frameSizeSlider').removeClass('disabled');
					break;
				case "outer_frame_no":
					$('.subMenu-23').parent('li').addClass('hidden');
					$('.subMenu-42').parent('li').addClass('hidden');
					$('.subMenu-42').parents('ul').removeClass('flex');
					$('.subMenu-24').text('Add Outer Container');
					$(".containerOptions").addClass('active');
					$('.cancelFrameContainer').parent('li').removeClass('hidden');
					$('.containerFrameSlider').addClass('hidden');
					break;

				case "inner_frame_yes":
					$('.subMenu-40').text('Edit Inner Container');
					$('.subMenu-40').parent('li').removeClass('disabled');

					$('.subMenu-41').parent('li').removeClass('hidden');
					$('.subMenu-41').parent('li').removeClass('active');

					$('.subMenu-44').parent('li').removeClass('hidden');
					$('.subMenu-44').parent('li').removeClass('active');

					$(".innerContainerOptions").removeClass('active');
					$('.cancelIconFrameContainer').parent('li').addClass('hidden');
					break;
				case "inner_frame_no":
					$('.subMenu-40').text('Add Inner Container');
					if (p_oUndoRedoobj.generate.templatePath.isIcon == 1 || p_oUndoRedoobj.generate.templatePath.isMono == 1) {

					} else {
						$('.subMenu-40').parent('li').addClass('disabled');
					}
					$('.subMenu-41').parent('li').addClass('hidden');
					$('.subMenu-44').parent('li').addClass('hidden');
					$(".innerContainerOptions").addClass('active');
					$('.cancelIconFrameContainer').parent('li').removeClass('hidden');
					break;
			}
		},
		/**
		 * 
		 */
		dieUndoRedo: function () {
			if (editorUndoRedo.undoRedoObj) {
				editorUndoRedo.undoRedoObj.die();
			}
		},
		/**
		 * 
		 * @param {*} p_oUndoRedoObj 
		 * @param {*} p_sPrevAct 
		 * @param {*} p_sType 
		 */
		undoRedoTheLogo: function (p_oUndoRedoObj, p_sPrevAct, p_sType = "", p_sHackedValue) {
			let sloganText = null;
			lEditor.updateFontsObject("logo", p_oUndoRedoObj.generate)
				.then(_ => {
					if (p_oUndoRedoObj.generate.templatePath.isDBLineCompanyText == "yes") {
						lEditor.updateFontsObject("logoName2", p_oUndoRedoObj.generate).then(_ => {
							sloganText = lEditor.getSession('sloganText');
							if (sloganText && sloganText !== "" && sloganText !== " ") {
								lEditor.updateFontsObject("slogan", p_oUndoRedoObj.generate)
									.then(_ => {
										if (p_oUndoRedoObj.generate.templatePath.isMono == 1) {
											lEditor.updateFontsObject("mono", p_oUndoRedoObj.generate)
												.then(_ => {
													editorUndoRedo.generateUndoRedoLogoTemplate(p_sType, p_oUndoRedoObj, p_sPrevAct, p_sHackedValue);
												});
										} else {
											editorUndoRedo.generateUndoRedoLogoTemplate(p_sType, p_oUndoRedoObj, p_sPrevAct, p_sHackedValue);
										}
									});
							}
							else {
								if (p_oUndoRedoObj.generate.templatePath.isMono == 1) {
									lEditor.updateFontsObject("mono", p_oUndoRedoObj.generate)
										.then(_ => {
											editorUndoRedo.generateUndoRedoLogoTemplate(p_sType, p_oUndoRedoObj, p_sPrevAct, p_sHackedValue);
										});
								} else {
									editorUndoRedo.generateUndoRedoLogoTemplate(p_sType, p_oUndoRedoObj, p_sPrevAct, p_sHackedValue);
								}
							}
						});
					} else {
						sloganText = lEditor.getSession('sloganText');
						if (sloganText && sloganText !== "" && sloganText !== " ") {
							lEditor.updateFontsObject("slogan", p_oUndoRedoObj.generate)
								.then(_ => {
									if (p_oUndoRedoObj.generate.templatePath.isMono == 1) {
										lEditor.updateFontsObject("mono", p_oUndoRedoObj.generate)
											.then(_ => {
												editorUndoRedo.generateUndoRedoLogoTemplate(p_sType, p_oUndoRedoObj, p_sPrevAct, p_sHackedValue);
											});
									} else {
										editorUndoRedo.generateUndoRedoLogoTemplate(p_sType, p_oUndoRedoObj, p_sPrevAct, p_sHackedValue);
									}
								});
						}
						else {
							if (p_oUndoRedoObj.generate.templatePath.isMono == 1) {
								lEditor.updateFontsObject("mono", p_oUndoRedoObj.generate)
									.then(_ => {
										editorUndoRedo.generateUndoRedoLogoTemplate(p_sType, p_oUndoRedoObj, p_sPrevAct, p_sHackedValue);
									});
							} else {
								editorUndoRedo.generateUndoRedoLogoTemplate(p_sType, p_oUndoRedoObj, p_sPrevAct, p_sHackedValue);
							}
						}
					}

				});
		},
		/**
		 * 
		 * @param {*} $for 
		 * @param {*} p_oUndoRedoobj 
		 * @param {*} p_sPrevAct 
		 */
		generateUndoRedoLogoTemplate: function ($for, p_oUndoRedoobj, p_sPrevAct, p_sHackedValue) {
			debugConsole("generateUndoRedoLogoTemplate for:=" + $for + ",,,,,p_oUndoRedoobj:=" + p_oUndoRedoobj);
			let currLogo = p_oUndoRedoobj;
			let logoTemp = null;
			var changeLogoName;
			switch ($for) {
				case LOGO_TEXT_TRANSFORM:
					currLogo.logoName = p_oUndoRedoobj.logoName;
					lEditor.setSession("logoname", currLogo.logoName);
					$('.editCompanyName').val(currLogo.logoName);
					break;
				case LOGO_TEXT1_TRANSFORM:
					currLogo.logoName1 = p_oUndoRedoobj.logoName1;
					changeLogoName = currLogo.logoName1 + " " + p_oUndoRedoobj.logoName2;
					lEditor.setSession('logoname', changeLogoName);
					$('.company-text-dd').text(changeLogoName);
					break;
				case LOGO_TEXT2_TRANSFORM:
					currLogo.logoName2 = p_oUndoRedoobj.logoName2;
					changeLogoName = p_oUndoRedoobj.logoName1 + " " + currLogo.logoName2;
					lEditor.setSession('logoname', changeLogoName);
					$('.company-text-dd').text(changeLogoName);
					break;
				case SLOGAN_REMOVE:
					currLogo.sloganName = p_oUndoRedoobj.sloganName;
					lEditor.setSession("sloganText", currLogo.sloganName);
					$('.editSloganName').val(currLogo.sloganName);
					break;
				case SLOGAN_TEXT_TRANSFORM:
					currLogo.sloganName = p_oUndoRedoobj.sloganName;
					lEditor.setSession("sloganText", currLogo.sloganName);
					$('.editSloganName').val(currLogo.sloganName);
					break;
				default:
					break;
			}

			if (($for == MONOGRAM_SIZE) || ($for == SYMBOL_SIZE) && p_sHackedValue) {
				currLogo.generate.iconDistanceSlider = p_sHackedValue;
			}

			let returnObj = editorUndoRedo.updateUndoRedoLogoTemplateByOption(p_oUndoRedoobj, p_oUndoRedoobj.idKey);
			logoTemp = returnObj.logoObj;
			currLogo.generate = logoTemp;

			$('.finaLogoInner').html('<div class="svg--slide" style="background-color:' + p_oUndoRedoobj.generate.bgColor + ';"><div class="svg-slide--content svgSlideContent"><div class="water-mark-img"></div>' + returnObj.html + '<div class="bgOutlineBox bg-outline-box"></div></div></div>');

			currLogo = updateCurrLogoObject(currLogo);
			lEditor.setDefaultLogo(currLogo, currLogo.generate);

			var parentlink = parseInt(lEditor.getSession("parentlink"));
			var targetlink = parseInt(lEditor.getSession("targetlink"));
			debugConsole("parentlink:=" + parentlink);
			debugConsole("targetlink:=" + targetlink);
			var prevAct = p_sPrevAct;
			debugConsole("p_sPrevAct=" + p_sPrevAct);
			if (prevAct == "redo") {
				prevAct = $for;
			}
			debugConsole("prevAct=" + prevAct);
			switch (parseInt(lEditor.getSession("parentlink"))) {
				case 3: // Edit Colors
					switch (parseInt(lEditor.getSession("targetlink"))) {
						case 12:
							updateColorPickerValue(p_oUndoRedoobj.generate.bgColor, false, "background", 0);
							$(".submenu_3").find(".subMenu-12").parent('li').removeClass('disabled');
							lEditor.setSession('colorDataType', "background");
							break;
						case 13:
							$(".submenu_3").find(".subMenu-13").parent('li').removeClass('disabled');
							lEditor.setSession('colorDataType', "foreground");
							var parentDiv = $('.subChild-13').find(".company-text-color-box");
							if ((prevAct == EDIT_COLORS_LOGO_TEXT1) || ((prevAct == EDIT_GRADIENT_COLORS_LOGO_TEXT1))) {
								if (parentDiv.hasClass("hidden")) {
									parentDiv.removeClass("hidden");
								}
								updateColorPickerValue(p_oUndoRedoobj.generate.mainTextColor, false, "foreground", 13);
								$('.subChild-13').find(".company-text-color-box").attr("last_selected", "dd-ct-color-line1");
							} else if ((prevAct == EDIT_COLORS_LOGO_TEXT2) || (prevAct == EDIT_GRADIENT_COLORS_LOGO_TEXT2)) {
								if (parentDiv.hasClass("hidden")) {
									parentDiv.removeClass("hidden");
								}
								updateColorPickerValue(p_oUndoRedoobj.generate.mainText2Color, false, "foreground", 13);
								$('.subChild-13').find(".company-text-color-box").attr("last_selected", "dd-ct-color-line2");
							} else {
								if (p_oUndoRedoobj.generate.templatePath.isDBLineCompanyText == "yes") {
									if (parentDiv.hasClass("hidden")) {
										parentDiv.removeClass("hidden");
									}
								}
								updateColorPickerValue(p_oUndoRedoobj.generate.mainTextColor, false, "foreground", 13);
							}
							break;
						case 14:
							updateColorPickerValue(p_oUndoRedoobj.generate.sloganTextColor, false, "foreground", 14);
							$(".submenu_3").find(".subMenu-14").parent('li').removeClass('disabled');
							lEditor.setSession('colorDataType', "foreground");
							break;
						case 15:
							updateColorPickerValue(p_oUndoRedoobj.generate.iconColor, false, "foreground", 15);
							$(".submenu_3").find(".subMenu-15").parent('li').removeClass('disabled');
							lEditor.setSession('colorDataType', "foreground");
							break;
						case 43:
							updateColorPickerValue(p_oUndoRedoobj.generate.iconFrameColor, false, "foreground", 43);
							$(".submenu_3").find(".subMenu-43").parent('li').removeClass('disabled');
							lEditor.setSession('colorDataType', "foreground");
							break;
						case 16:
							if (p_oUndoRedoobj.generate.templatePath.frameType === "filled") {
								updateColorPickerValue(p_oUndoRedoobj.generate.frameFilledColor, false, "foreground", 16);
							} else {
								updateColorPickerValue(p_oUndoRedoobj.generate.frameColor, false, "foreground", 16);
							}
							$(".submenu_3").find(".subMenu-16").parent('li').removeClass('disabled');
							lEditor.setSession('colorDataType', "foreground");
							break;
					}
					break;
				case 5: // Symbol
					if (p_oUndoRedoobj.generate.templatePath.isIcon == 1) {
						editorUndoRedo.showTopMenuEditTabs("mono_no", p_oUndoRedoobj);
						editorUndoRedo.showTopMenuEditTabs("icon_yes", p_oUndoRedoobj);
					}
					else if (p_oUndoRedoobj.generate.templatePath.isMono == 1) {
						editorUndoRedo.showTopMenuEditTabs("icon_no", p_oUndoRedoobj);
						editorUndoRedo.showTopMenuEditTabs("mono_yes", p_oUndoRedoobj);
					}
					else {
						editorUndoRedo.showTopMenuEditTabs("icon_no", p_oUndoRedoobj);
						editorUndoRedo.showTopMenuEditTabs("mono_no", p_oUndoRedoobj);
					}
					break;
				case 6: // Container
					debugConsole("p_oUndoRedoobj.generate.templatePath.isFrame:=" + p_oUndoRedoobj.generate.templatePath.isFrame);
					if (p_oUndoRedoobj.generate.templatePath.isFrame == 1) {
						editorUndoRedo.showTopMenuEditTabs("outer_frame_yes", p_oUndoRedoobj);
					} else {
						editorUndoRedo.showTopMenuEditTabs("outer_frame_no", p_oUndoRedoobj);
					}
					debugConsole("p_oUndoRedoobj.generate.templatePath.isIconFrame:=" + p_oUndoRedoobj.generate.templatePath.isIconFrame);
					if (p_oUndoRedoobj.generate.templatePath.isIconFrame == 1) {
						editorUndoRedo.showTopMenuEditTabs("inner_frame_yes", p_oUndoRedoobj);
					} else {
						editorUndoRedo.showTopMenuEditTabs("inner_frame_no", p_oUndoRedoobj);
					}
					break;
			}

			onTextFontSizeSlide($(".logoTextSlider"), p_oUndoRedoobj.generate.logoTextSlider, true);
			onTextLetterSpacingSlide($(".logoLetterSpacing"), p_oUndoRedoobj.generate.logoLetterSpacing, true);
			onSloganFontSizeSlide($(".sloganTextSize"), p_oUndoRedoobj.generate.sloganTextSize, true);

			onSloganLetterSpacingSlide($(".sloganLetterSpacing"), p_oUndoRedoobj.generate.sloganLetterSpacing, true);

			debugConsole("p_oUndoRedoobj.generate.textSloganDistSlider:=" + p_oUndoRedoobj.generate.textSloganDistSlider);
			onTextSloganDistanceSlide($('.textSloganDistSlider'), p_oUndoRedoobj.generate.textSloganDistSlider, true);

			onSymbolSizeSlide($(".logoSizeSlider"), p_oUndoRedoobj.generate.logoSizeSlider, true);
			debugConsole("p_oUndoRedoobj.generate.iconDistanceSlider:=" + p_oUndoRedoobj.generate.iconDistanceSlider);
			debugConsole("p_sHackedValue:=" + p_sHackedValue);
			if (($for == MONOGRAM_SIZE) || ($for == SYMBOL_SIZE) && p_sHackedValue) {
				onSymbolDistanceSlide($(".iconDistanceSlider"), p_sHackedValue, true);
			} else {
				onSymbolDistanceSlide($(".iconDistanceSlider"), p_oUndoRedoobj.generate.iconDistanceSlider, true);
			}

			onOuterFrameSizeSlide($('.frameSizeSlider'), p_oUndoRedoobj.generate.frameSizeSlider, true);

			eanbledSloganTool();

			saveSliderData();
			editorUndoRedo.showBlocker(false);
			createTempHint();
		},
		/**
		 * 
		 * @param {*} currLogo 
		 * @param {*} $for 
		 * @param {*} idKey 
		 */
		updateUndoRedoLogoTemplateByOption: function (currLogo, idKey) {
			debugConsole("updateUndoRedoLogoTemplateByOption:=" + ",,,," + idKey);
			var logoObj = currLogo.generate;
			var obj = {};

			var getSVGTag = logoMakerFunction.getDynamicSvgTag();
			var template = null;
			if (getSVGTag != "") {
				template = getSVGTag;
			} else {
				template = '<svg version="1.1" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" height="100%" width="100%" x="0px" y="0px" viewBox="0 0 ' + constantVars.VIEWBOXWIDTH + ' ' + constantVars.VIEWBOXHEIGHT + '" xml:space="preserve" preserveAspectRatio="xMidYMid meet" class="">{{textGradient}}{{text2Gradient}}{{sloganGradient}}{{iconGradient}}{{frameGradient}}{{iconFrameGradient}}';
			}

			template += '<rect x="0px" y="0px" width="100%" height="100%" fill="{{svgColor}}"/>';
			template += '<g class="logo-container-box logoContainerBox" transform="scale({{logoContainerScale}}) translate({{logoContainerX}},{{logoContainerY}})">';
			if (logoObj.templatePath.isFrame == 1) {
				template += '<g class="container_1" transform="scale({{frameScale}}) translate({{frameX}},{{frameY}})"  fill="{{frameFill}}">{{frameHtml}}</g>';
			}
			template += '<g class="containerBody" transform="scale({{containerBodyScale}}) translate({{containerBodyX}},{{containerBodyY}})" >';
			if (logoObj.templatePath.isIcon == 1 || logoObj.templatePath.isMono == 1) {
				template += '<g class="sampleIconBox" transform="scale({{iconFrameBoxScale}}) translate({{iconFrameBoxX}},{{iconFrameBoxY}})">';
				if (logoObj.templatePath.isIconFrame == 1) {
					template += '<g class="iconFrame" transform="scale({{iconFrameScale}}) translate({{iconFrameX}},{{iconFrameY}})"  fill="{{iconFrameFill}}">{{iconFrameHtml}}</g>';
				}
				template += '<g class="sampleIcons_1" transform="scale({{iconScale}}) translate({{iconX}},{{iconY}})" fill="{{iconFill}}">{{iconHtml}}</g>';
				template += '</g>';
			}
			template += '<g class="sampleTexts_1" transform="scale({{textAndSloganScale}}) translate({{textAndSloganX}},{{textAndSloganY}})">';

			if (logoObj.templatePath.isDBLineCompanyText == "yes") {
				template += '<g class="logo--name svgLogoName_1 logoNameBox1" transform="scale({{text1Scale}}) translate({{text1X}},{{text1Y}})" fill="{{text1Fill}}">{{text1Html}}</g>';

				template += '<g class="logo--name svgLogoName_2 logoNameBox2" transform="scale({{text2Scale}}) translate({{text2X}},{{text2Y}})" fill="{{text2Fill}}">{{text2Html}}</g>';
			} else {
				template += '<g class="logo--name svgLogoName_1 logoNameBox" transform="scale({{textScale}}) translate({{textX}},{{textY}})" fill="{{textFill}}">{{textHtml}}</g>';
			}

			template += '<g id="" class="logo--name svgSloganText_1 sloganBox" transform="scale({{sloganScale}}) translate({{sloganX}},{{sloganY}})" fill="{{sloganFill}}">{{sloganHtml}}</g>';
			template += '</g>';
			template += '</g>';
			template += '</g>';
			template += '</svg>';

			if (logoObj.textGradient != "") {
				logoObj.mainTextColor = 'url(#textGradient' + idKey + ')';
			}

			if (logoObj.templatePath.isDBLineCompanyText == "yes" && logoObj.text2Gradient != "") {
				logoObj.mainText2Color = 'url(#text2Gradient' + idKey + ')';
			}

			if (logoObj.sloganGradient != "") {
				logoObj.sloganTextColor = 'url(#sloganGradient' + idKey + ')';
			}
			if (logoObj.frameGradient != "") {
				logoObj.frameColor = 'url(#frameGradient' + idKey + ')';
			}
			if (logoObj.iconGradient != "") {
				logoObj.iconColor = 'url(#iconGradient' + idKey + ')';
			}
			if (logoObj.iconFrameGradient != "") {
				logoObj.iconFrameColor = 'url(#iconFrameGradient' + idKey + ')';
			}
			if (logoObj.frameFilledGradient != "" && logoObj.templatePath.frameType == "filled") {
				logoObj.frameFilledColor = 'url(#frameGradient' + idKey + ')';
			}

			//apply gradient to template
			template = logoMakerFunction.applyGradientToTemplate(template, logoObj, idKey);

			template = template.replace("{{svgColor}}", logoObj.bgColor);

			if (logoObj.templatePath.isDBLineCompanyText == "yes") {
				template = template.replace("{{text1Html}}", logoObj.logoPath1);
				template = template.replace("{{text1Fill}}", logoObj.mainTextColor);

				template = template.replace("{{text2Html}}", logoObj.logoPath2);
				template = template.replace("{{text2Fill}}", logoObj.mainText2Color);
			} else {
				template = template.replace("{{textHtml}}", logoObj.logoPath);
				template = template.replace("{{textFill}}", logoObj.mainTextColor);
			}


			template = template.replace("{{sloganHtml}}", logoObj.sloganPath);
			template = template.replace("{{sloganFill}}", logoObj.sloganTextColor);

			template = template.replace("{{frameHtml}}", logoObj.framePath);
			if (logoObj.templatePath.frameType == "filled") {
				template = template.replace("{{frameFill}}", logoObj.frameFilledColor);
			} else {
				template = template.replace("{{frameFill}}", logoObj.frameColor);
			}
			if (logoObj.templatePath.isIcon == 1 || logoObj.templatePath.isMono == 1) {
				template = template.replace("{{iconHtml}}", logoObj.iconPath);
				template = template.replace("{{iconFill}}", logoObj.iconColor);
				template = template.replace("{{iconX}}", logoObj.templatePath.icon.x);
				template = template.replace("{{iconY}}", logoObj.templatePath.icon.y);
				template = template.replace("{{iconScale}}", logoObj.templatePath.icon.scale);
				template = template.replace("{{iconFrameFill}}", logoObj.iconFrameColor);

				template = template.replace("{{iconFrameBoxX}}", logoObj.templatePath.iconFrameBox.x);
				template = template.replace("{{iconFrameBoxY}}", logoObj.templatePath.iconFrameBox.y);
				if (logoObj.templatePath.isIconFrame == 1) {
					template = template.replace("{{iconFrameBoxScale}}", logoObj.templatePath.iconFrameBox.scale);
				} else {
					template = template.replace("{{iconFrameBoxScale}}", logoObj.templatePath.iconFrameBoxScale);
				}

			}
			if (logoObj.templatePath.isIconFrame == 1) {
				template = template.replace("{{iconFrameHtml}}", logoObj.iconFramePath);
				template = template.replace("{{iconFrameFill}}", logoObj.iconFrameColor);
				template = template.replace("{{iconFrameX}}", logoObj.templatePath.iconFrame.x);
				template = template.replace("{{iconFrameY}}", logoObj.templatePath.iconFrame.y);
				template = template.replace("{{iconFrameScale}}", logoObj.templatePath.iconFrame.scale);
			}

			if (logoObj.templatePath.isDBLineCompanyText == "yes") {
				template = template.replace("{{text1X}}", logoObj.templatePath.text1.x);
				template = template.replace("{{text1Y}}", logoObj.templatePath.text1.y);
				template = template.replace("{{text1Scale}}", logoObj.templatePath.text1.scale);

				template = template.replace("{{text2X}}", logoObj.templatePath.text2.x);
				template = template.replace("{{text2Y}}", logoObj.templatePath.text2.y);
				template = template.replace("{{text2Scale}}", logoObj.templatePath.text2.scale);
			} else {
				template = template.replace("{{textX}}", logoObj.templatePath.text.x);
				template = template.replace("{{textY}}", logoObj.templatePath.text.y);
				template = template.replace("{{textScale}}", logoObj.templatePath.text.scale);
			}

			template = template.replace("{{sloganX}}", logoObj.templatePath.slogan.x);
			template = template.replace("{{sloganY}}", logoObj.templatePath.slogan.y);
			template = template.replace("{{sloganScale}}", logoObj.templatePath.slogan.scale);

			template = template.replace("{{textAndSloganX}}", logoObj.templatePath.textAndSlogan.x);
			template = template.replace("{{textAndSloganY}}", logoObj.templatePath.textAndSlogan.y);
			template = template.replace("{{textAndSloganScale}}", logoObj.templatePath.textAndSlogan.scale);

			template = template.replace("{{containerBodyX}}", logoObj.templatePath.containerBody.x);
			template = template.replace("{{containerBodyY}}", logoObj.templatePath.containerBody.y);
			template = template.replace("{{containerBodyScale}}", logoObj.templatePath.containerBody.scale);

			template = template.replace("{{logoContainerX}}", logoObj.templatePath.logoContainer.x);
			template = template.replace("{{logoContainerY}}", logoObj.templatePath.logoContainer.y);
			template = template.replace("{{logoContainerScale}}", logoObj.templatePath.logoContainer.scale);

			template = template.replace("{{frameX}}", logoObj.templatePath.frame.x);
			template = template.replace("{{frameY}}", logoObj.templatePath.frame.y);
			template = template.replace("{{frameScale}}", logoObj.templatePath.frame.scale);

			$("#templateGenerator").html(template);

			template = $("#templateGenerator").html();
			$("#templateGenerator").html('');
			return { 'logoObj': logoObj, 'html': template };
		},
		/**
		 * 
		 * @param {*} p_bValue 
		 */
		showBlocker: function (p_bValue) {
			if (p_bValue) {
				$("#click_blocker").show();
			} else {
				$("#click_blocker").hide();
			}
		}
	}
});
function clearException() {
	editor_exceptions = new Array();
}
function debugConsole(p_sValue, p_bValue) {
	if (DH.DH_APP_MODE == 'DEVELOPMENT') {
		console.log(p_sValue);
	}
}
function forceConsoleAtStaging(p_sValue) {
	if ((DH.DH_APP_MODE == 'DEVELOPMENT') || (DH.DH_APP_MODE == 'STAGING')) {
		console.log(p_sValue);
	}
}
function forceConsoleAtLive(p_sValue) {
	if (DH.DH_APP_MODE == 'PRODUCTION') {
		console.log(p_sValue);
	}
}
/**
 * convert string to object
 * @param {*} p_value 
 */
function getValidJsonParseObj(p_value) {
	let valueType = typeof (p_value);
	let jsonParseObj = null;
	switch (valueType) {
		case "object":
			jsonParseObj = p_value;
			break;
		case "string":
			jsonParseObj = JSON.parse(p_value);
			break;
		default:
			debugConsole("getValidJsonParseObj invalid case valueType:=" + valueType);
			break;
	}
	return jsonParseObj;
}
/**
 * convert object to string
 * @param {*} p_value 
 */
function getValidJsonStringifyObj(p_value) {
	let valueType = typeof (p_value);
	let jsonStringifyObj = null;
	switch (valueType) {
		case "object":
			jsonStringifyObj = JSON.stringify(p_value);
			break;
		case "string":
			jsonStringifyObj = p_value;
			break;
		default:
			debugConsole("getValidJsonStringifyObj invalid case valueType:=" + valueType);
			break;
	}
	return jsonStringifyObj;
}
/**
 * 
 * @param {*} p_oCurrentJSON 
 */
function getDataAnalsyis(p_oCurrentJSON) {
	debugConsole("getDataAnalsyis:=");
	var daObj = new Object();
	if (p_oCurrentJSON) {
		if (p_oCurrentJSON.generate.templatePath.template_direction) {
			daObj.templateDirection = p_oCurrentJSON.generate.templatePath.template_direction;
		}
		if (p_oCurrentJSON.generate.templatePath.template_id) {
			daObj.finalTemplateId = p_oCurrentJSON.generate.templatePath.template_id; // final logo template id
			if (p_oCurrentJSON.data_analysis && p_oCurrentJSON.data_analysis.templateId) { // inital template id as per step6
				daObj.templateId = p_oCurrentJSON.data_analysis.templateId;
			} else {
				daObj.templateId = p_oCurrentJSON.generate.templatePath.template_id;
			}
		}
		if (p_oCurrentJSON.fId) {
			daObj.companyNameFontId = p_oCurrentJSON.fId; // company name font id
		}
		if (p_oCurrentJSON.sloganName && p_oCurrentJSON.sloganName != "" && p_oCurrentJSON.sloganName != " ") {
			daObj.sloganFontId = p_oCurrentJSON.sfId; // slogan font id
		}
		if (p_oCurrentJSON.generate.templatePath.isIcon && p_oCurrentJSON.generate.templatePath.isIcon == 1) {
			daObj.iconId = p_oCurrentJSON.iconId; // icon id as per noun api
			// daObj.iconName = p_oCurrentJSON.generate.iconName;
			if (p_oCurrentJSON.generate.templatePath.isIconFrame && p_oCurrentJSON.generate.templatePath.isIconFrame == 1) {
				daObj.iconInnerFrameId = p_oCurrentJSON.iconFrameId; // inner frame id
			}
		}

		if (p_oCurrentJSON.generate.templatePath.isMono && p_oCurrentJSON.generate.templatePath.isMono == 1) {
			daObj.monogramFontId = p_oCurrentJSON.monofId; // mono font id
			if (p_oCurrentJSON.generate.templatePath.isIconFrame && p_oCurrentJSON.generate.templatePath.isIconFrame == 1) {
				daObj.iconInnerFrameId = p_oCurrentJSON.iconFrameId; // inner frame id
			}
		}
		if (p_oCurrentJSON.generate.templatePath.isFrame && p_oCurrentJSON.generate.templatePath.isFrame == 1) {
			daObj.outerFrameId = p_oCurrentJSON.frmId; // outer frame id
			daObj.outerFrameType = p_oCurrentJSON.generate.templatePath.frameType; // outer frame type
		}
		if (p_oCurrentJSON.cpId) {
			daObj.colorsSchemaId = p_oCurrentJSON.cpId; // colors schema
		}
		if (p_oCurrentJSON.generate.templatePath.isDBLineCompanyText) {
			daObj.isDoubleLineCompanyText = p_oCurrentJSON.generate.templatePath.isDBLineCompanyText; // double line company text
		}
	}
	return daObj;
}
/**
 * 
 * @param {*} p_sAction 
 */
function createLogging(p_sAction) {
	var logo_maker_logging_list = new Array();
	var loggingObj = new Object();
	loggingObj.action = p_sAction;
	debugConsole("createLogging :=" + p_sAction);
	try {
		loggingObj.currentPage = getValidJsonStringifyObj(sessionStorage.getItem("currPage"));
		loggingObj.currLogoId = getValidJsonStringifyObj(sessionStorage.getItem("currLogoId"));
		loggingObj.logoName = getValidJsonStringifyObj(sessionStorage.getItem("logoname"));
		loggingObj.targetLink = getValidJsonStringifyObj(sessionStorage.getItem("targetlink"));
		loggingObj.parentLink = getValidJsonStringifyObj(sessionStorage.getItem("parentlink"));
		loggingObj.backLink = getValidJsonStringifyObj(sessionStorage.getItem("backLink"));
		loggingObj.sessionStorageUsed = getUsedSessionStorageSize();
		logo_maker_logging_list.push(loggingObj);
	}
	catch (e) {
		loggingObj.error = e;
	}
	return logo_maker_logging_list;
}
/**
 * 
 */
function getUsedSessionStorageSize() {
	var finalStr = "";
	try {
		var _lsTotal = 0, _xLen, _x;
		for (_x in sessionStorage) {
			if (!sessionStorage.hasOwnProperty(_x)) {
				continue;
			}
			_xLen = ((sessionStorage[_x].length + _x.length) * 2);
			_lsTotal += _xLen;
			var str1 = "";
			if (finalStr == "") {
				str1 = _x.substr(0, 50) + " = " + (_xLen / 1024).toFixed(2) + " KB";
			} else {
				str1 = "," + _x.substr(0, 50) + " = " + (_xLen / 1024).toFixed(2) + " KB";
			}
			finalStr = finalStr + str1;
		};
		var str2 = ",Total = " + (_lsTotal / 1024).toFixed(2) + " KB";
		finalStr = finalStr + str2;
	} catch (e) {
		finalStr = e;
	}
	return finalStr;
}
/**
 * 
 * @param {*} p_sString 
 */
function removeMultipleSpaces(p_sString) {
	if (p_sString && p_sString !== "") {
		return p_sString.replace(/^\s+|\s+$|\s+(?=\s)/g, "");
	}
	return p_sString;
}
/**
 * function calling outisde the js
 */
function refreshOnIconExpired() {
	debugConsole('refreshOnIconExpired');
	try {
		var sampleArr = getValidJsonParseObj(sessionStorage.getItem('sampleIcon'));
		if (typeof sampleArr != 'undefined' && sampleArr != null) {
			if (sampleArr.si != null && !$.isEmptyObject(sampleArr.si)) {
				sampleArr = sampleArr.si;
				debugConsole("sampleArr:=" + sampleArr + ",,," + sampleArr.length);
				if (sampleArr && sampleArr.length > 0) {
					for (var i = 0; i < sampleArr.length; i++) {
						var iconId = sampleArr[i].id;
						$('.showIconsDiv [data-id="' + iconId + '"]').removeClass('active');
						$('.editShowIconsDiv [data-id="' + iconId + '"]').removeClass('active');
						$('.hide--icons').remove();
					}
					sessionStorage.setItem('sampleIcon', getValidJsonStringifyObj({ "si": '' }));
					$('.symbol-container .iconContainerBoxes').html('');
					$('.symbol-container .iconEditContainerBoxes').html('');
					debugConsole("url:" + window.location.href);
					location.reload(true);
				}
			}
		}
	} catch (err) {
		forceConsoleAtLive("something went wrong in refreshOnIconExpired ", err);
	}
}
/**
 * 
 * @param {*} p_oTemplatePath 
 * @param {*} sloganText 
 * @param {*} p_sCompanyTextFontId 
 * @param {*} p_sColorSchemaId 
 * @param {*} p_sSloganFontId 
 * @param {*} p_sOuterFrameId 
 * @param {*} p_sIconFrameId 
 * @param {*} p_sMonoGramFontId 
 * @param {*} isTempHint 
 */
function showLogoAdminIds(p_oTemplatePath, sloganText, p_sCompanyTextFontId, p_sColorSchemaId, p_sSloganFontId, p_sOuterFrameId, p_sIconFrameId, p_sMonoGramFontId, isTempHint = false) {
	var templateHint = "";
	if ((DH.DH_APP_MODE == 'STAGING') || (DH.DH_APP_MODE == 'DEVELOPMENT') || (DH.userId == dh_logomaker_admin_view)) {
		var sep = "/";
		if (isTempHint) {
			sep = "<br/>";
		}
		var txtStyle = "color:#7fff00;font-weight: 600;font-size: 12px;";

		templateHint = "<b>template id:=</b><span style='" + txtStyle + "'>" + p_oTemplatePath.template_id + "</span>" + sep + "<b>isEqual:=</b><span style='" + txtStyle + "'>" + p_oTemplatePath.isEqual + "</span>" + sep + "<b>companyText font id:=</b><span style='" + txtStyle + "'>" + p_sCompanyTextFontId + "</span>";

		if ((DH.DH_APP_MODE == 'STAGING') || (DH.DH_APP_MODE == 'DEVELOPMENT')) {
			templateHint = templateHint + sep + "<b>isDBLineCompanyText:=</b><span style='" + txtStyle + "'>" + p_oTemplatePath.isDBLineCompanyText + "</span>"
		}

		if (sloganText && sloganText != "") {
			templateHint = templateHint + sep + "<b>slogan font id:=</b><span style='" + txtStyle + "'>" + p_sSloganFontId + "</span>";
		}

		if (p_oTemplatePath.isFrame == 1) {
			templateHint = templateHint + sep + "<b>outer frame id:=</b><span style='" + txtStyle + "'>" + p_sOuterFrameId + "</span>";
		}

		if (p_oTemplatePath.isIconFrame == 1) {
			templateHint = templateHint + sep + "<b>icon frame id:=</b><span style='" + txtStyle + "'>" + p_sIconFrameId + "</span>";
		}

		if (p_oTemplatePath.isMono == 1) {
			templateHint = templateHint + sep + "<b>monogram font id:=</b><span style='" + txtStyle + "'>" + p_sMonoGramFontId + "</span>";
		}
		templateHint = templateHint + sep + "<b>colors schema id:=</b><span style='" + txtStyle + "'>" + p_sColorSchemaId + "</span>";

		if ((DH.DH_APP_MODE == 'STAGING') || (DH.DH_APP_MODE == 'DEVELOPMENT')) {
			templateHint = templateHint + sep + "<b>sloganSetAsPerText:=</b><span style='" + txtStyle + "'>" + p_oTemplatePath.sloganSetAsPerText + "</span>";
			templateHint = templateHint + sep + "<b>template_db_id:=</b><span style='" + txtStyle + "'>" + p_oTemplatePath.template_db_id + "</span>";

		}
		templateHint = removeMultipleSpaces(templateHint);
	}
	return templateHint;
}
/**
 * 
 */
function getTempStyle() {
	var templateIdStyle = "";
	if ((DH.DH_APP_MODE == 'STAGING') || (DH.DH_APP_MODE == 'DEVELOPMENT') || (DH.userId == dh_logomaker_admin_view)) {
		templateIdStyle = 'background-color:black;position: absolute;color:white;top:0px;left:0px;z-index:9;font-size:11px;padding-left:5px;';
	} else {
		templateIdStyle = 'display:none';
	}
	return templateIdStyle;
}
/**
 * 
 */
function createTempHint() {
	if ((DH.userId == dh_logomaker_admin_view) && (DH.DH_APP_MODE != 'DEVELOPMENT')) {
		if ($(".editFinalLogo").hasClass("hidden")) {
			forceConsoleAtStaging("no need to create createTempHint");
			return;
		}

		if ($("#finaLogoInnerTemplateHint").length) {
			$("#finaLogoInnerTemplateHint").hide().remove();
		}

		$("<div/>", {
			"id": "finaLogoInnerTemplateHint",
			"style": "position: absolute;width: 425px;height: 100px;top: 300px;left: 10px"
		}).appendTo($(".editFinalLogo"));
		var currLogo = getValidJsonParseObj(sessionStorage.getItem('currentLogo'));
		var templateHint = showLogoAdminIds(currLogo.generate.templatePath, currLogo.sloganName, currLogo.fId, currLogo.cpId, currLogo.sfId, currLogo.frmId, currLogo.iconFrameId, currLogo.monofId, true);
		var templateIdStyle = getTempStyle() + "padding:5px";

		$("#finaLogoInnerTemplateHint").html('<div style="' + templateIdStyle + '">' + templateHint + '</div>');
	}
	// Note-
	//In dh_config.inc we add this line define('DH_LOGOMAKER_ADMIN_VIEW_ID', 726324);
	// 726324 is user_id at localhost against mail rahul.verma@relesol.com
	//DH.userId == dh_logomaker_admin_view this condition check DH.userId == 726324
}
/**
 * 
 * @param {*} array 
 */
function shuffleTheArray(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}



