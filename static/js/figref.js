$(function() {
    var figure = 0;
    $(this).find("figure").each(function() {
        figure++;
        var s = "Fig. " + figure;
        $(this).attr('figure_number', figure);
        $(this).find('figcaption').each(function() {
            var text = s + ' ' + $(this).text();
            $(this).text(text);
        })
    });
});

$(function() {
    $("a.figref").each(function() {
        var attribute_name = 'figure_number';
        var selector = $(this).attr('href');
        var $figure = $(selector);
        var s = $figure.attr('figure_number');
        if (typeof s == 'undefined' || s == false) {
            var id = $(this).attr('id')
            console.log(`Could not get attribute [${attribute_name}] for element with id [${id}]`)
            s = 'Fig. ?'
        } else {
            s = `Fig. ${s}`
        }
        $(this).text(s);
        $(this).css('font-weight', 'bold');
    });
});
