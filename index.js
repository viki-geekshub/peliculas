const peliculasContainer = document.querySelector('main.peliculas');
const baseImgUrl = 'https://image.tmdb.org/t/p/w185';

const paginah3 = document.getElementById('pagina');
let page = 1;
const getPeliculasPopulares = (page) => {
    if(page<1){
        page=1
    }else{
        paginah3.innerText = page;

    fetch('https://api.themoviedb.org/3/movie/popular?api_key=cea68b520beecac6718820e4ac576c3a&language=es-ES&page=' + page)
        .then(res => res.json())
        .then(res => {
            const peliculas = res.results;
            peliculasContainer.innerHTML = '';
            peliculas.forEach(pelicula => {
                const imagen = pelicula.poster_path ? `
                <img src="${baseImgUrl}${pelicula.poster_path}" alt="">` : '<h3 class="noimagen">No hay imagen disponible</h3>' 
                peliculasContainer.innerHTML += `
                <div class="pelicula" onclick="getPeliculaDetailed(${pelicula.id})">
                <h3 class="title">${pelicula.title}
                </h3>
                ${imagen}
            </div>`
            })
        })
        .catch(error => console.error(error)) // No hace falta pero lo pongo por buenas prácticas.
    }
}
getPeliculasPopulares(page);

document.querySelector('.form-inline').addEventListener('submit', event => event.preventDefault())

document.querySelector('.buscarForm')
    .addEventListener('submit', event => {
        if (event.target.buscarInput.value !== '') {
            event.preventDefault();
            fetch('https://api.themoviedb.org/3/search/movie?api_key=cea68b520beecac6718820e4ac576c3a&language=es-ES&query=' + event.target.buscarInput.value)
                .then(res => res.json())
                .then(res => {
                    const peliculas = res.results;
                    peliculasContainer.innerHTML = '';
                    const baseImgUrl = 'https://image.tmdb.org/t/p/w185';
                    if (peliculas.length > 0) {
                        peliculas.forEach(pelicula => {
                            const imagen = pelicula.poster_path ? `
                    <img src="${baseImgUrl}${pelicula.poster_path}" alt="">` : '<h3 class="noimagen">No hay imagen disponible</h3>'
                            peliculasContainer.innerHTML += `
                    <div class="pelicula" onclick="getPeliculaDetailed(${pelicula.id})">
                    <h3 class="title">${pelicula.title}
                    </h3>
                    ${imagen}
                    </div>`
                        })
                    } else {
                        peliculasContainer.innerHTML += `<div class="nothing"><h2>No hay coincidencias</h2> </div>`
                    }

                })
                .catch(error => console.error(error))
        }
    })

const getPeliculaDetailed = movie_id => {
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
                </div>
            </div>`
            } else {
                peliculasContainer.innerHTML = `
            <div class="details">
                <h3 class="title">${pelicula.title}</h3>
                <div class="imageDetails">
                    <img src="${baseImgUrl}${pelicula.poster_path}" alt="">
                    <p><h3 class="noimagen nodescripcion">No hay descripción disponible</h3></p>
                </div>
            </div>`
            }

        })
}

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