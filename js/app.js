window.windowCreated = new Date();

$(document).ready(function() {
	
	window.docCreated = new Date();
	
	var spreadsheetKey = '0At5zQXh2AKd6dDh1TWp5NUYyRGRuYTBhQWdsSDNRZGc';	
	Tabletop.init({ 
		key: spreadsheetKey,
		callback: buildApp
	});

	window.tplHeader = Handlebars.compile($("#tplHeader").html());
	window.tplPage   = Handlebars.compile($("#tplPage").html());
	window.tplFooter = Handlebars.compile($("#tplFooter").html());

});
	

function buildApp(data, tabletop) {
	
	window.dataCreated = new Date();

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

	// build header HTML
	var headerHtml = tplHeader({
		flag: header.flag, 
		logoURL: header.logoURL, 
		summary: header.summary, 
		pages: pages
	});
	
	$("header").html(headerHtml);
	
	window.contentCreated = new Date();
	
	window.loadingPerformance = [docCreated-windowCreated, dataCreated-windowCreated, contentCreated-windowCreated];
	console.log(loadingPerformance);
}
	