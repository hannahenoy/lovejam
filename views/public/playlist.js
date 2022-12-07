let save = document.getElementsByClassName("save");
const deleteSaved = document.querySelectorAll(".deleteSaved")
const favorite = document.getElementsByClassName('fa-heart')


Array.from(favorite).forEach(function(element) {
  element.addEventListener('click', function(e){
    e.preventDefault()
    const songTitle = this.parentNode.parentNode.childNodes[1].innerText
    const favorites = e.target.classList.contains('purple') ? true : false
    fetch('favorites', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'songTitle': songTitle,
        'favorites': favorites
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
  });
});

Array.from(save).forEach(function(element) {
    element.addEventListener('click', function(){
      // console.log('trying to save')
      const songTitle = this.parentNode.parentNode.querySelector('.albumName').innerText
      const cover = this.parentNode.parentNode.querySelector('.albumCover').innerText
      const moviePoster = this.parentNode.parentNode.querySelector('.link').innerText
      fetch('saveMovie', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          'songTitle': songTitle,
          'cover': cover,
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
  Array.from(deleteSaved).forEach(function(element) {
    element.addEventListener('click', function(){
      fetch('deleteSave', {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'id': element.id
        })
      }).then(function (response) {
        window.location.reload()
      })
    });
  });
  