const API = 'https://jsonplaceholder.typicode.com'
const TIMEOUT = 8000;


function fetchComTimeout(url) {
  return new Promise(function(resolve, reject) {
    var timer = setTimeout(function() {
      reject(new Error('Timeout: a API demorou demais para responder.'));
    }, TIMEOUT);
 
    fetch(url)
      .then(function(res) {
        clearTimeout(timer);
        if (!res.ok) throw new Error('Erro HTTP ' + res.status);
        return res.json();
      })
      .then(resolve)
      .catch(function(err) {
        clearTimeout(timer);
        reject(err);
      });
  });
}

function iniciais(nome) {
  return nome.split(' ').slice(0, 2).map(function(n) {
    return n[0];
  }).join('').toUpperCase();
}
fetchComTimeout(API + '/users')
  .then(function(usuarios) {
    var badge = document.getElementById('api-badge');
    badge.textContent = 'API conectada — ' + usuarios.length + ' colaboradores';
    badge.className = 'api-badge ok';
 
    var div = document.getElementById('usuarios');
    div.innerHTML = '';
 
    usuarios.forEach(function(usuario) {
      var btn = document.createElement('button');
      btn.className = 'usuario-btn';
      btn.innerHTML =
        '<div class="avatar-btn">' + iniciais(usuario.name) + '</div>' +
        '<span>' + usuario.name.split(' ')[0] + ' ' + usuario.name.split(' ').slice(-1)[0] + '</span>';
 
      btn.onclick = function() {
        selecionarUsuario(usuario, btn);
      };
 
      div.appendChild(btn);
    });
  })
  .catch(function(err) {
    var badge = document.getElementById('api-badge');
    badge.textContent = 'API indisponível';
    badge.className = 'api-badge err';
 
    var erro = document.getElementById('erro');
    erro.style.display = 'block';
    erro.innerHTML = 'Falha na conexão! <br> ' + err.message;
  });

function selecionarUsuario(usuario, btn) {
  // Marca botão ativo
  document.querySelectorAll('.usuario-btn').forEach(function(b) {
    b.classList.remove('ativo');
  });
  btn.classList.add('ativo');
 
  // Esconde estado vazio
  document.getElementById('empty-state').style.display = 'none';
 
  // Preenche o card de perfil
  document.getElementById('avatar').textContent = iniciais(usuario.name);
  document.getElementById('nome-perfil').textContent = usuario.name;
  document.getElementById('email-perfil').textContent = usuario.email;
  document.getElementById('empresa-perfil').textContent = usuario.company.name;
  document.getElementById('perfil-card').style.display = 'flex';
 
  // Mostra seção de postagens e carrega
  document.getElementById('secao-posts').style.display = 'block';
  document.getElementById('postagens').innerHTML = '<p class="loading-text">Carregando postagens...</p>';
 
  fetchComTimeout(API + '/posts?userId=' + usuario.id)
    .then(function(posts) {
      document.getElementById('perfil-total').textContent = posts.length;
 
      var div = document.getElementById('postagens');
      div.innerHTML = '';
 
      posts.forEach(function(post) {
        var card = document.createElement('div');
        card.className = 'post';
        card.innerHTML =
          '<h3>' + post.title + '</h3>' +
          '<p>' + post.body + '</p>' +
          '<div class="comentarios" id="comentarios-' + post.id + '">' +
            '<p class="comentarios-label">Comentários</p>' +
          '</div>';
 
        card.onclick = function() {
          toggleComentarios(post.id, card);
        };
 
        div.appendChild(card);
      });
    })
    .catch(function(err) {
      document.getElementById('postagens').innerHTML =
        '<p class="loading-text">Erro ao carregar postagens: ' + err.message + '</p>';
    });
}
 
 
function toggleComentarios(postId, card) {
  var div = document.getElementById('comentarios-' + postId);
 
  // Se já está aberto, fecha
  if (div.style.display === 'block') {
    div.style.display = 'none';
    card.classList.remove('aberto');
    return;
  }
 
  div.style.display = 'block';
  card.classList.add('aberto');
  div.innerHTML = '<p class="comentarios-label">Carregando comentários...</p>';
 
  fetchComTimeout(API + '/posts/' + postId + '/comments')
    .then(function(comentarios) {
      div.innerHTML = '<p class="comentarios-label">' + comentarios.length + ' comentários</p>';
 
      comentarios.forEach(function(c) {
        var item = document.createElement('div');
        item.className = 'comentario';
        item.innerHTML =
          '<strong>' + c.name + '</strong>' +
          '<p>' + c.body + '</p>';
        div.appendChild(item);
      });
    })
    .catch(function(err) {
      div.innerHTML = '<p class="loading-text">Erro: ' + err.message + '</p>';
    });
}