const peliculasContainer = document.querySelector('main.peliculas');
const baseImgUrl = 'https://image.tmdb.org/t/p/w185';
let mode = "popular"; // Para decirle si estamos en modo "peliculas populares" o modo "búsqueda"
let busqueda = ""; // inizializo la búsqueda en un string vacío.
const paginah3 = document.getElementById('pagina');
let page = 1; // inizializo la página en la página 1
let total_pages = Infinity; // inizializo la variable del total de paginas de la api en Infinity
let generos = []; // Creo un array vacío para guardar dentro los géneros
fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=cea68b520beecac6718820e4ac576c3a&language=es-ES')
    .then(res => res.json())
    .then(res => generos = res.genres)

const changePage = step => { // Función para cambiar de página en función de si estamos en modo popular o modo búsqueda
    page += step
    if (page === 0) page = 1; // Para que cuando la página sea 0 nos lleve a la página 1
    if (page > total_pages) { // Y si la pagina es mayor que  el total de páginas
        page = total_pages // que se quede en el total de paginas (la última página que haya en cada caso)
    }
    if (mode === "popular") { // Si el modo es "popular" llamo a la funcion de pelis populares
        getPeliculasPopulares(page)
    } else if (mode === "search") { // si el modo es "search" llamo a la funcion de buscar pelis
        buscarPelis(busqueda, page)
    }
}

const getPeliculasPopulares = (page) => { // Función para obtener las películas populares
    if (page < 1 || mode !== "popular") {
        page = 1;
    }
    mode = "popular"
    paginah3.innerText = page;
    fetch('https://api.themoviedb.org/3/movie/popular?api_key=cea68b520beecac6718820e4ac576c3a&language=es-ES&page=' + page)
        .then(res => res.json())
        .then(res => {
            const peliculas = res.results;
            total_pages = res.total_pages
            peliculasContainer.innerHTML = '';
            peliculas.forEach(pelicula => {
                const generosPelicula = generos.filter(genero => pelicula.genre_ids.includes(genero.id)).map(genero => genero.name).join(', '); // GENEROS - Filtrado por id, transformar un array de dos elementos en un array de un solo elemento, y convertirlos en strings separados por una coma y un espacio.
                // INTRODUCIR CADA PELÍCULA:
                const imagen = pelicula.poster_path ? `
                <img src="${baseImgUrl}${pelicula.poster_path}" alt="" onclick="getPeliculaDetailed(${pelicula.id})">` : '<h3 class="noimagen">No hay imagen disponible</h3>'
                peliculasContainer.innerHTML += `
                <div class="pelicula">
                <h3 class="title" onclick="getPeliculaDetailed(${pelicula.id})">${pelicula.title}
                </h3>
                ${imagen}
                <h6 class="genero">${generosPelicula}</h6>
            </div>`
            })
            window.scrollTo({
                top: 0
            });
        })
        .catch(error => console.error(error)) // No hace falta pero lo pongo por buenas prácticas.
}
getPeliculasPopulares(page); // Llamo a la función para que me saque las películas populares al cargar la página

const buscarPelis = (busqueda, page = 1) => { // Función para buscar películas
    if (page < 1 || mode !== "search") {
        console.log(page, mode)
        page = 1;
    }
    mode = "search";
    paginah3.innerText = page;
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=cea68b520beecac6718820e4ac576c3a&language=es-ES&page=${page}&query=${busqueda}`)
        .then(res => res.json())
        .then(res => {
            total_pages = res.total_pages;
            const peliculas = res.results;
            peliculasContainer.innerHTML = '';
            const baseImgUrl = 'https://image.tmdb.org/t/p/w185';
            if (peliculas.length > 0) {
                peliculas.forEach(pelicula => {
                    const generosPelicula = generos.filter(genero => pelicula.genre_ids.includes(genero.id)).map(genero => genero.name).join(', '); // GENEROS - Filtro por id, transformo un array de dos elementos en un array de un solo elemento, convierto sus elementos en strings, separados entre ellos por una coma y un espacio.
                    const imagen = pelicula.poster_path ? `
                    <img src="${baseImgUrl}${pelicula.poster_path}" alt="" onclick="getPeliculaDetailed(${pelicula.id})">` : '<h3 class="noimagen">No hay imagen disponible</h3>'
                    peliculasContainer.innerHTML += `
                    <div class="pelicula">
                    <h3 class="title"  onclick="getPeliculaDetailed(${pelicula.id})">${pelicula.title}</h3>
                    ${imagen}
                    <h6 class="genero">${generosPelicula}</h6>
                    </div>`
                })
            } else {
                peliculasContainer.innerHTML += `<div class="nothing"><h2>No hay coincidencias</h2> </div>`
            }
            window.scrollTo({
                top: 0
            });
        })
        .catch(error => console.error(error))
}
document.querySelector('.form-inline').addEventListener('submit', event => event.preventDefault()) // Para que no refresque la página por defecto cuando se haga un submit

document.querySelector('.buscarForm')
    .addEventListener('submit', event => { // Función para que si no escribe nada el usuario, el buscador no haga nada y que cuando escriba algo, nos haga la búsqueda
        if (event.target.buscarInput.value !== '') {
            event.preventDefault();
            page = 1;
            busqueda = event.target.buscarInput.value;
            buscarPelis(busqueda)
        }
    })

const volverAtras = () => { // Funcionalidad del botón para volver atrás desde la descripción
    if (mode === "search") {
        buscarPelis(busqueda, page);
    } else if (mode === "popular") {
        getPeliculasPopulares(page);
    }
}

const getPeliculaDetailed = movie_id => { // Función para que nos saque la descripción al hacer click en cada película
    axios.get(`https://api.themoviedb.org/3/movie/${movie_id}?api_key=cea68b520beecac6718820e4ac576c3a&language=es-ES`)
        .then(res => {
            const pelicula = res.data;
            if (pelicula.overview !== '') {
                peliculasContainer.innerHTML = `
            <div class="details">
                <h3 class="title">${pelicula.title}</h3>
                <div class="imageDetails">
                    <img src="${baseImgUrl}${pelicula.poster_path}" alt="">
                    <p>${pelicula.overview}</p>
                    <button class="atras" onclick="volverAtras()">Atrás</button>
                </div>
            </div>`
            } else {
                peliculasContainer.innerHTML = `
            <div class="details">
                <h3 class="title">${pelicula.title}</h3>
                <div class="imageDetails">
                    <img src="${baseImgUrl}${pelicula.poster_path}" alt="">
                    <p><h3 class="noimagen nodescripcion">No hay descripción disponible</h3></p>
                    <button class="atras" onclick="volverAtras()">Atrás</button>
                </div>
            </div>`
            }

        })
}