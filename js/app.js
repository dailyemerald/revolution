window.windowCreated = new Date();

$(document).ready(function() {
	
	// some load time metrics
	window.docCreated = new Date(); 
	
	// spin up tabletop. takes about half a second to get the doc from google and fire the callback
	Tabletop.init({ 
		key: '0At5zQXh2AKd6dDh1TWp5NUYyRGRuYTBhQWdsSDNRZGc',
		callback: buildApp
	});

	// the templates are inline, so let's compile 'em. 
	// TODO: CDN and precompiled.
	window.tplHeader = Handlebars.compile($("#tplHeader").html());
	window.tplTitle  = Handlebars.compile($("#tplTitle").html());
	window.tplPage   = Handlebars.compile($("#tplPage").html());
	window.tplFooter = Handlebars.compile($("#tplFooter").html());
});
	

function buildApp(data, tabletop) {
	
	window.dataCreated = new Date();

	// wrangle our google spreadsheet into useful structures
	var header = {};
	tabletop.models.header.elements.forEach(function(pair) {
		header[pair.element] = pair.content;
	});

	var footer = {};	
	tabletop.models.footer.elements.forEach(function(pair) {
		header[pair.element] = pair.content;
	});

	var pages = [];
	tabletop.models.pages.elements.forEach(function(page) {
		pages.push(page);
	});
	
	var icons = [];
	tabletop.models.icons.elements.forEach(function(icon) {
		icons.push(icon);
	});

	// build header HTML
	var headerHtml = tplHeader({
		flag: header.flag, 
		logoURL: header.logoURL, 
		summary: header.summary, 
		title: header.title,
		pages: pages,
		icons: icons
	});
	console.log(headerHtml);
	
	$("#headercontent").html(headerHtml);
	
	window.pagesHtml = {};
	window.titleHtml = {};
	pages.forEach(function(page) {
		var pageContentList = page.content.split("\n");
		page.contentFormatted = pageContentList.join("<br>\n");
		console.log(page);
		pagesHtml[page.slug] = tplPage(page);		
		
		titleHtml[page.slug] = tplTitle(page);
	});
	
	console.log(pagesHtml);
	
	//console.log(pagesHtml);
	
	// spin up the router from backbone to switch out the main div on hash changes
	var AppRouter = Backbone.Router.extend({
		routes: {
			"!/*route": "defaultRoute",
			"*route": "defaultRoute" //TODO: is there a cleaner way to do this?
		},
		defaultRoute: function(route) {
			if (route == '') route = 'video'; //TODO: this is a hack. should it be the first page in the model?
			console.log(route);
			$("li").removeClass('active')
			$("#"+route).addClass('active');
			$("#title").html( titleHtml[route] )
			$("#contentwrapper").html( pagesHtml[route] );
		}
	});
	var app = new AppRouter;
	Backbone.history.start();
	
	// more timing metrics, just curious on load time
	// because the page is empty until this is done...
	window.contentCreated = new Date();
	window.loadingPerformance = [docCreated-windowCreated, dataCreated-windowCreated, contentCreated-windowCreated];
	
	//TODO: send this back to the server to gauge how slow it really is.
	if (console) console.log(loadingPerformance);
}
	