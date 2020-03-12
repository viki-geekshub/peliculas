const peliculasContainer=document.querySelector('main.peliculas');

fetch('https://api.themoviedb.org/3/movie/popular?api_key=cea68b520beecac6718820e4ac576c3a&language=es-ES&page=1')
        .then(res=>res.json())
        .then(res=>{
            const peliculas =res.results;
            peliculasContainer.innerHTML='';
            const baseImgUrl= 'https://image.tmdb.org/t/p/w185';
            peliculas.forEach(pelicula=>{
                const imagen = pelicula.poster_path ? `
                <img src="${baseImgUrl}${pelicula.poster_path}" alt="">`:''
                peliculasContainer.innerHTML+=`
                <div class="pelicula">
                <h3 class="title">${pelicula.title}
                </h3>
                ${imagen}
            </div>`
            })
        })
        .catch(error => console.log(error)) // esto no haria falta, porque no tenemos error. Pero por buenas prácticas lo ponemos.

document.querySelector('.form-inline').addEventListener('submit',event=>event.preventDefault())

// document.querySelector("#boton").addEventListener('click', event => {
// fetch('https://api.themoviedb.org/3/search/movie?api_key=cea68b520beecac6718820e4ac576c3a&language=es-ES&query='+event.target.value)
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
    
document.querySelector('.buscarInput')
.addEventListener('keyup',event=>{
    if(event.key === 'Enter'){
        event.preventDefault();
        fetch('https://api.themoviedb.org/3/search/movie?api_key=cea68b520beecac6718820e4ac576c3a&language=es-ES&query='+event.target.value)
        .then(res=>res.json())
        .then(res=>{
            const peliculas =res.results;
            peliculasContainer.innerHTML='';
            const baseImgUrl= 'https://image.tmdb.org/t/p/w185';
            if( peliculas.length > 0){
                peliculas.forEach(pelicula=>{
                    const imagen = pelicula.poster_path ? `
                    <img src="${baseImgUrl}${pelicula.poster_path}" alt="">`:''
                    
                    peliculasContainer.innerHTML+=`
                    <div class="pelicula">
                <h3 class="title">${pelicula.title}
                </h3>
                ${imagen}
            </div>`
                })    
            }else{
                peliculasContainer.innerHTML += `<div class="nothing"><h2>No hay coincidencias</h2> </div>`
            }
            
        })
    }

        // axios.get('https://api.themoviedb.org/3/search/movie?api_key=cea68b520beecac6718820e4ac576c3a&language=es-ES&query='+event.target.value)
        // .then(res=>{
        //     const peliculas =res.data.results;
        //     peliculasContainer.innerHTML='';
        //     const baseImgUrl= 'https://image.tmdb.org/t/p/w185';
        //     peliculas.forEach(pelicula=>{
        //         const imagen = pelicula.poster_path ? `
        //         <img src="${baseImgUrl}${pelicula.poster_path}" alt="">`:''
        //         peliculasContainer.innerHTML+=`
        //         <div class="pelicula">
        //             <h3 class="title">${pelicula.title}
        //         </h3>
        //         ${imagen}
        //     </div>`
        //     })
        // })
    }
)