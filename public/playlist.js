let save = document.getElementsByClassName("save");
const deleteSaved = document.querySelectorAll(".deleteSaved")

Array.from(save).forEach(function(element) {
    element.addEventListener('click', function(){
      // console.log('trying to save')
      const songTitle = this.parentNode.querySelector('.albumName').innerText
      const moviePoster = this.parentNode.querySelector('.link').innerText
      fetch('saveMovie', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          'songTitle': songTitle,
          'moviePoster': moviePoster
        })
      })
      .then(response => {
        console.log(response)
        if (response.ok) return response.json()
      })
      .then(data => {
        console.log(data)
        window.location.reload(true)
      })
    });
  });
  
  deleteSaved.forEach((button) => {
    button.addEventListener('click', function(){
      let movieId = button.parentNode.childNodes[1].innerText
      console.log(movieId)
      console.log(button.parentNode.childNodes)
  
      fetch('deleteSave', {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          movieId: movieId,
        })
      }).then(function (response) {
        window.location.reload()
      })
    });
  })
  