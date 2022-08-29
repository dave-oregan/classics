const games = [
    'Meteoroids - v1.2 21 August 2022 arcade shooter space',
    'Extraterrestrials - v1.0 21 August 2022 arcade shooter space',
    'Pizza Man - v1.0 Day Month 2022 arcade food maze',
    'Template - v1.0 Day Month Year tag#1 tag#2 tag#3'
];
var gamesToShow = [];

function search()
{
    let search_tag = $("#search_input").val();
    let search_array = search_tag.split(" ");
    gamesToShow = [];
    $('.sc_item').hide();
    for (let i=0; i<games.length; i++)
    {
        for (let k=0; k<search_array.length; k++)
        {
            if(games[i].toLowerCase().includes(search_array[k].toLowerCase()))
            {
                gamesToShow.push(games[i].substring(0,games[i].indexOf(' ')));
                break;
            }
        }
    }
    for (let i=0; i<gamesToShow.length; i++)
    {
        $('#'+gamesToShow[i]).show();
    }
}