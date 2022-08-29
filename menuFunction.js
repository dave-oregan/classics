function replaceMenu(item)
{
    console.log(item);
    if (item=='menu_tog')
    {
        $('#menu_tog').slideToggle();
        $('#sidemenu').empty();
        $('#sidemenu').append(`<ul id=menu_ul style=display:none;position:absolute;margin-top:0.5em;><li id=ul_title>MENU</li><li><a class='gb' href=index.html>Home</a></li><li><a class='gb' href=about.html>About</a></li><li id=ul_title>SEARCH</li><li><div id=search_box><input id=menu_search name=search placeholder='Search...' type=text><a class=gb_search onclick='localStorage.setItem("search_value",$("#menu_search").val());' href=search.html><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg></a></div></li><li id=ul_title>TAGS</li><li><a class='gb' href=search.html>All</a></li><li><a class='gb' onclick='localStorage.setItem("search_value","Arcade");' href=search.html>Arcade</a></li><li><a class='gb' onclick='localStorage.setItem("search_value","Shooter");' href=search.html>Shooter</a></li><li><a class='gb' onclick='localStorage.setItem("search_value","Space");' href=search.html>Space</a></li><li><span id='detect' onclick='$("#sidemenu").toggleClass("expanded");replaceMenu($(this).attr("id"));'><a class=gb style=font-size:xx-large;>▲</a></span></li></ul>
        <script>
            $(document).ready(() =>
            {
                $('#menu_search').keyup((e) =>
                {
                    if (e.which == 13)
                    {
                        localStorage.setItem("search_value",$("#menu_search").val());
                        window.location.href = 'search.html';
                    }
                });
            })
        </script>`);
        $('#menu_ul').slideToggle();
    }
    else if (item=='detect')
    {
        $('#sidemenu').empty();
        $('#sidemenu').append(`<span id=menu_tog style=display:none; onclick='$("#sidemenu").toggleClass("expanded");replaceMenu($(this).attr("id"));'><a class=gb style=font-size:4em;><b>≡</b></a></span>`);
        $('#menu_tog').slideToggle();
    }
}

function replaceMenu_SC(item)
{
    console.log(item);
    if (item=='menu_tog')
    {
        $('#menu_tog').slideToggle();
        $('#sidemenu').empty();
        $('#sidemenu').append(`<ul id=menu_ul_sc style=display:none;position:absolute;margin-top:0.5em;><li id=ul_title>MENU</li><li><a class='gb' href=index.html>Home</a></li><li><a class='gb' href=about.html>About</a></li><li><span id='detect' onclick='$("#sidemenu").toggleClass("expanded");replaceMenu_SC($(this).attr("id"));'><a class=gb style=font-size:xx-large;>▲</a></span></li></ul>`);
        $('#menu_ul_sc').slideToggle();
    }
    else if (item=='detect')
    {
        $('#sidemenu').empty();
        $('#sidemenu').append(`<span id=menu_tog style=display:none; onclick='$("#sidemenu").toggleClass("expanded");replaceMenu_SC($(this).attr("id"));'><a class=gb style=font-size:4em;><b>≡</b></a></span>`);
        $('#menu_tog').slideToggle();
    }
}

function replaceMenuG(item)
{
    console.log(item);
    if (item=='menu_tog')
    {
        $('#menu_tog').slideToggle();
        $('#sidemenu').empty();
        $('#sidemenu').append(`<ul id=menu_ul style=display:none;position:absolute;margin-top:0.5em;><li id=ul_title>MENU</li><li><a class='gb' href=../index.html>Home</a></li><li><a class='gb' href=../about.html>About</a></li><li id=ul_title>SEARCH</li><li><div id=search_box><input id=menu_search name=search placeholder='Search...' type=text><a class=gb_search onclick='localStorage.setItem("search_value",$("#menu_search").val());' href=../search.html><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg></a></div></li><li id=ul_title>TAGS</li><li><a class='gb' href=search.html>All</a></li><li><a class='gb' onclick='localStorage.setItem("search_value","Arcade");' href=../search.html>Arcade</a></li><li><a class='gb' onclick='localStorage.setItem("search_value","Shooter");' href=../search.html>Shooter</a></li><li><a class='gb' onclick='localStorage.setItem("search_value","Space");' href=../search.html>Space</a></li><li><span id='detect' onclick='$("#sidemenu").toggleClass("expanded");replaceMenuG($(this).attr("id"));'><a class=gb style=font-size:xx-large;>▲</a></span></li></ul>`);
        $('#menu_ul').slideToggle();
    }
    else if (item=='detect')
    {
        $('#sidemenu').empty();
        $('#sidemenu').append(`<span id=menu_tog style=display:none; onclick='$("#sidemenu").toggleClass("expanded");replaceMenuG($(this).attr("id"));'><a class=gb style=font-size:4em;><b>≡</b></a></span>`);
        $('#menu_tog').slideToggle();
    }
}