const peliculasContainer = document.querySelector('main.peliculas');
const baseImgUrl = 'https://image.tmdb.org/t/p/w185';
let mode = "popular"; // Para decirle si estamos en modo "peliculas populares" o modo "búsqueda"
let busqueda = ""; // inizializo la búsqueda en un string vacío.
const paginah3 = document.getElementById('pagina');
let page = 1; // inizializo la página en la página 1

let generos = []; // Creo un array vacío para guardar dentro los géneros
fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=cea68b520beecac6718820e4ac576c3a&language=es-ES')
    .then(res => res.json())
    .then(res => generos = res.genres)

const changePage = step => { // Función para cambiar de página en función de si estamos en modo popular o modo búsqueda
    page += step
    if (mode === "popular") {
        getPeliculasPopulares(page)
    } else if (mode === "search") {
        buscarPelis(busqueda, page)
    }
}

const getPeliculasPopulares = (page) => { // Función para obtener las películas populares
    if (page < 1 || mode !== "popular") {
        page = 1
    }
    mode = "popular"
    paginah3.innerText = page;

    fetch('https://api.themoviedb.org/3/movie/popular?api_key=cea68b520beecac6718820e4ac576c3a&language=es-ES&page=' + page)
        .then(res => res.json())
        .then(res => {
            const peliculas = res.results;
            peliculasContainer.innerHTML = '';
            peliculas.forEach(pelicula => {

                const generosPelicula = generos.filter(genero => pelicula.genre_ids.includes(genero.id)).map(genero => genero.name).join(', '); // GENEROS - Filtrado por id, transformar un array de dos elementos en un array de un solo elemento, y convertirlos en strings separados por una coma y un espacio.
                // INTRODUCIR CADA PELÍCULA:
                const imagen = pelicula.poster_path ? `
                <img src="${baseImgUrl}${pelicula.poster_path}" alt="">` : '<h3 class="noimagen">No hay imagen disponible</h3>'
                peliculasContainer.innerHTML += `
                <div class="pelicula" onclick="getPeliculaDetailed(${pelicula.id})">
                <h3 class="title">${pelicula.title}
                </h3>
                ${imagen}
                <h6 class="genero">${generosPelicula}</h6>
            </div>`
            })
            window.scrollTo({top:0});
        })
        .catch(error => console.error(error)) // No hace falta pero lo pongo por buenas prácticas.

}
getPeliculasPopulares(1); // Llamo a la función para que me saque las películas populares al cargar la página

const buscarPelis = (busqueda, page = 1) => { // Función para buscar películas
    if (page < 1 || mode !== "search") {
        page = 1
    }
    mode = "search";
    paginah3.innerText = page;
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=cea68b520beecac6718820e4ac576c3a&language=es-ES&page=${page}&query=${busqueda}`)
        .then(res => res.json())
        .then(res => {
            const peliculas = res.results;
            peliculasContainer.innerHTML = '';
            const baseImgUrl = 'https://image.tmdb.org/t/p/w185';
            if (peliculas.length > 0) {
                peliculas.forEach(pelicula => {

                    const generosPelicula = generos.filter(genero => pelicula.genre_ids.includes(genero.id)).map(genero => genero.name).join(', '); // GENEROS - Filtrado por id, transformar un array de dos elementos en un array de un solo elemento, y convertirlos en strings separados por una coma y un espacio.

                    const imagen = pelicula.poster_path ? `
                    <img src="${baseImgUrl}${pelicula.poster_path}" alt="">` : '<h3 class="noimagen">No hay imagen disponible</h3>'
                    peliculasContainer.innerHTML += `
                    <div class="pelicula" onclick="getPeliculaDetailed(${pelicula.id})">
                    <h3 class="title">${pelicula.title}
                    </h3>
                    ${imagen}
                    <h6 class="genero">${generosPelicula}</h6>
                    </div>`
                })
            } else {
                peliculasContainer.innerHTML += `<div class="nothing"><h2>No hay coincidencias</h2> </div>`
            }
            window.scrollTo({top:0});
        })
        .catch(error => console.error(error))
}
document.querySelector('.form-inline').addEventListener('submit', event => event.preventDefault()) // para que no refresque la página por defecto cuando se haga un submit

document.querySelector('.buscarForm')
    .addEventListener('submit', event => { // funcion para que si no escribe nada el usuario, el buscador no haga nada y si escribe algo, nos haga la búsqueda
        if (event.target.buscarInput.value !== '') {
            event.preventDefault();
            page = 1;
            busqueda = event.target.buscarInput.value;
            buscarPelis(busqueda)
        }
    })

// const volverAtras = getPeliculaDetailed(); => {
//         if (pelicula.overview !== '') {
//             // const generosPelicula = generos.filter(genero=>pelicula.genres.includes(genero.id))
//             // .map(genero => genero.name).join(', ');  // NO FUNCIONA
//             peliculasContainer.innerHTML = `
//     <div class="details">
//         <h3 class="title">${pelicula.title}</h3>
//         <div class="imageDetails">
//             <img src="${baseImgUrl}${pelicula.poster_path}" alt="">
//             <p>${pelicula.overview}</p>
//             <button class="atras" onclick="">Atrás</button>
//         </div>
//     </div>`
//         } else {
//             peliculasContainer.innerHTML = `
//     <div class="details">
//         <h3 class="title">${pelicula.title}</h3>
//         <div class="imageDetails">
//             <img src="${baseImgUrl}${pelicula.poster_path}" alt="">
//             <p><h3 class="noimagen nodescripcion">No hay descripción disponible</h3></p>
//         </div>
//     </div>`
//         }
//     }
// document.querySelector('button.atras').addEventListener('submit', event => event.volverAtras())


const getPeliculaDetailed = movie_id => { // funcion para que nos saque la descripción al hacer click en cada peli
    axios.get(`https://api.themoviedb.org/3/movie/${movie_id}?api_key=cea68b520beecac6718820e4ac576c3a&language=es-ES`)
        .then(res => {
            const pelicula = res.data;
            if (pelicula.overview !== '') {
                // const generosPelicula = generos.filter(genero=>pelicula.genres.includes(genero.id))
                // .map(genero => genero.name).join(', ');  // NO FUNCIONA
                peliculasContainer.innerHTML = `
            <div class="details">
                <h3 class="title">${pelicula.title}</h3>
                <div class="imageDetails">
                    <img src="${baseImgUrl}${pelicula.poster_path}" alt="">
                    <p>${pelicula.overview}</p>
                    <button class="atras" onclick="volverAtras">Atrás</button>
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



//<h6 class="genero">${generosPelicula}</h6>

// FALTA - Arreglar bug de los botones cuando llegan a paginas por debajo de 0. Arreglar botón peliculas populares porque tiene un bug. Meter los generos en la descripción. Hacer funcionalidad del botón de atrás

// OTRA FORMA DE HACERLO - PERO NO FUNCIONA EL BOTON

// document.querySelector("#boton").addEventListener('submit', event => {
//     event.preventDefault();
//     console.log("entra");
//     fetch('https://api.themoviedb.org/3/search/movie?api_key=cea68b520beecac6718820e4ac576c3a&language=es-ES&query='+event.target.buscarInput.value)
// .then(res=>res.json())
// .then(res=>{
//     const peliculas =res.results;
//     peliculasContainer.innerHTML='';
//     const baseImgUrl= 'https://image.tmdb.org/t/p/w185';
//     if( peliculas.length > 0){
//         peliculas.forEach(pelicula=>{
//             const imagen = pelicula.poster_path ? `
//             <img src="${baseImgUrl}${pelicula.poster_path}" alt="">`:''

//             peliculasContainer.innerHTML+=`
//             <div class="pelicula">
//         <h3 class="title">${pelicula.title}
//         </h3>
//         ${imagen}
//     </div>`
//         })    
//     }else{
//         peliculasContainer.innerHTML += `<div class="nothing"><h2>No hay coincidencias</h2> </div>`
//     }

//     })
// })

// document.querySelector('.buscarInput')
// .addEventListener('keyup',event=>{
//     if(event.key === 'Enter'){
//         event.preventDefault();
//         fetch('https://api.themoviedb.org/3/search/movie?api_key=cea68b520beecac6718820e4ac576c3a&language=es-ES&query='+event.target.value)
//         .then(res=>res.json())
//         .then(res=>{
//             const peliculas =res.results;
//             peliculasContainer.innerHTML='';
//             const baseImgUrl= 'https://image.tmdb.org/t/p/w185';
//             if( peliculas.length > 0){
//                 peliculas.forEach(pelicula=>{
//                     const imagen = pelicula.poster_path ? `
//                     <img src="${baseImgUrl}${pelicula.poster_path}" alt="">`:'<h3 class="noimagen">No hay imagen disponible</h3>'

//                     peliculasContainer.innerHTML+=`
//                     <div class="pelicula">
//                 <h3 class="title">${pelicula.title}
//                 </h3>
//                 ${imagen}
//             </div>`
//                 })    
//             }else{
//                 peliculasContainer.innerHTML += `<div class="nothing"><h2>No hay coincidencias</h2> </div>`
//             }

//         })
//     }
// })