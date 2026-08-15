import {
  createComment,
  deleteComment,
  getVideoById,
  replyToComment,
  toggleLike,
} from './api.js';
import { getSession, hasSession } from './session.js';
import { clearElement, createCallout, formatDate, formatDuration, renderNavbar, setLoading, setStatus } from './ui.js';

function getElements() {
  return {
    page: document.querySelector('[data-video-page]'),
    status: document.querySelector('[data-video-status]'),
    loader: document.querySelector('[data-video-loader]'),
    content: document.querySelector('[data-video-content]'),
    detail: document.querySelector('[data-video-detail]'),
    comments: document.querySelector('[data-comments-list]'),
    commentForm: document.querySelector('[data-comment-form]'),
    commentText: document.querySelector('[data-comment-text]'),
    likeButton: document.querySelector('[data-like-button]'),
    likeCount: document.querySelector('[data-like-count]'),
    authGuard: document.querySelector('[data-auth-guard]'),
    commentStatus: document.querySelector('[data-comment-status]'),
  };
}

function getVideoId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function renderPlayer(detail) {
  const player = document.querySelector('[data-video-player]');
  if (!player) {
    return;
  }

  clearElement(player);

  if (!detail?.urlVideo) {
    player.appendChild(createCallout('Este video no tiene una URL reproducible.', 'warning'));
    return;
  }

  const video = document.createElement('video');
  video.controls = true;
  video.preload = 'metadata';
  video.src = detail.urlVideo;

  if (detail.poster) {
    video.poster = detail.poster;
  }

  video.addEventListener('error', () => {
    const errorCallout = createCallout(
      'No fue posible reproducir el video desde su origen. Verifica tu conexión o intenta con otro video.',
      'danger',
    );
    player.appendChild(errorCallout);
  });

  player.appendChild(video);
}

function renderCommentControls(comment, session, onReply, onDelete) {
  const controls = document.createElement('div');
  controls.className = 'comment-actions';

  if (!session) {
    return controls;
  }

  if (comment.carne === session?.carne) {
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'button button-secondary button-small';
    deleteButton.textContent = 'Eliminar';
    deleteButton.addEventListener('click', () => onDelete(comment.id));
    controls.appendChild(deleteButton);
  }

  if (!comment.esRespuesta) {
    const replyButton = document.createElement('button');
    replyButton.type = 'button';
    replyButton.className = 'button button-small';
    replyButton.textContent = 'Responder';
    replyButton.addEventListener('click', () => onReply(comment.id));
    controls.appendChild(replyButton);
  }

  return controls;
}

function renderCommentItem(comment, session, onReply, onDelete) {
  const article = document.createElement('article');
  article.className = `comment ${comment.esRespuesta ? 'comment-reply' : ''}`;

  const header = document.createElement('header');
  header.className = 'comment-header';

  const author = document.createElement('strong');
  author.textContent = comment.estudiante || 'Estudiante';

  const meta = document.createElement('span');
  meta.className = 'muted';
  meta.textContent = `${comment.carne || ''}${comment.fecha ? ` · ${formatDate(comment.fecha)}` : ''}`;

  header.append(author, meta);

  const text = document.createElement('p');
  text.textContent = comment.texto || '';

  article.append(header, text, renderCommentControls(comment, session, onReply, onDelete));

  return article;
}

function renderComments(detail, session, refresh) {
  const commentsList = document.querySelector('[data-comments-list]');
  if (!commentsList) {
    return;
  }

  clearElement(commentsList);

  const comments = Array.isArray(detail?.comentarios) ? detail.comentarios : [];

  if (!comments.length) {
    commentsList.appendChild(createCallout('Aún no hay comentarios.', 'info'));
    return;
  }

  const onReply = (commentId) => {
    const target = commentsList.querySelector(`[data-reply-box-for="${commentId}"]`);
    if (target) {
      target.hidden = !target.hidden;
    }
  };

  const onDelete = async (commentId) => {
    if (!window.confirm('¿Eliminar este comentario?')) {
      return;
    }

    try {
      await deleteComment(commentId, session.carne);
      await refresh();
    } catch (error) {
      setStatus(document.querySelector('[data-comment-status]'), error.message || 'No fue posible eliminar el comentario.', 'danger');
    }
  };

  for (const comment of comments) {
    const commentShell = document.createElement('section');
    commentShell.className = 'comment-thread';

    commentShell.appendChild(renderCommentItem(comment, session, onReply, onDelete));

    const replyBox = document.createElement('form');
    replyBox.className = 'reply-form';
    replyBox.dataset.replyBoxFor = String(comment.id);
    replyBox.hidden = true;

    const replyLabel = document.createElement('label');
    replyLabel.className = 'sr-only';
    replyLabel.textContent = 'Respuesta';

    const replyInput = document.createElement('textarea');
    replyInput.id = `reply-${comment.id}`;
    replyInput.rows = 3;
    replyInput.name = 'reply';
    replyInput.placeholder = 'Escribe tu respuesta';
    replyInput.required = true;
    replyLabel.htmlFor = replyInput.id;

    const replyButton = document.createElement('button');
    replyButton.type = 'submit';
    replyButton.className = 'button';
    replyButton.textContent = 'Publicar respuesta';

    replyBox.append(replyLabel, replyInput, replyButton);

    replyBox.addEventListener('submit', async (event) => {
      event.preventDefault();

      const sessionNow = getSession();
      if (!sessionNow) {
        setStatus(document.querySelector('[data-comment-status]'), 'Debes iniciar sesión para interactuar.', 'warning');
        return;
      }

      const texto = replyInput.value.trim();
      if (!texto) {
        setStatus(document.querySelector('[data-comment-status]'), 'La respuesta no puede ir vacía.', 'warning');
        return;
      }

      try {
        replyButton.disabled = true;
        await replyToComment(comment.id, { carne: sessionNow.carne, texto });
        replyInput.value = '';
        replyBox.hidden = true;
        await refresh();
      } catch (error) {
        setStatus(document.querySelector('[data-comment-status]'), error.message || 'No fue posible responder.', 'danger');
      } finally {
        replyButton.disabled = false;
      }
    });

    commentShell.appendChild(replyBox);

    const replies = Array.isArray(comment.respuestas) ? comment.respuestas : [];
    if (replies.length) {
      const repliesContainer = document.createElement('div');
      repliesContainer.className = 'reply-list';

      for (const reply of replies) {
        repliesContainer.appendChild(
          renderCommentItem({ ...reply, esRespuesta: true }, session, onReply, onDelete),
        );
      }

      commentShell.appendChild(repliesContainer);
    }

    commentsList.appendChild(commentShell);
  }
}

function renderDetail(detail) {
  const detailElement = document.querySelector('[data-video-detail]');
  const likeCount = document.querySelector('[data-like-count]');

  if (!detailElement) {
    return;
  }

  clearElement(detailElement);

  const title = document.createElement('h1');
  title.textContent = detail.titulo ?? 'Video sin título';

  const description = document.createElement('p');
  description.className = 'lead';
  description.textContent = detail.descripcion ?? '';

  const meta = document.createElement('div');
  meta.className = 'detail-meta';

  const duration = document.createElement('span');
  duration.textContent = `Duración: ${formatDuration(detail.duracion)}`;

  const category = document.createElement('span');
  category.textContent = `Categoría: ${detail.categoria ?? 'Sin categoría'}`;

  meta.append(duration, category);
  detailElement.append(title, description, meta);

  if (likeCount) {
    likeCount.textContent = String(detail.likes ?? 0);
  }
}

async function refreshVideo(videoId, status, loader) {
  setLoading(loader, true, 'Cargando video...');
  setStatus(status, '');

  try {
    const detail = await getVideoById(videoId);
    renderDetail(detail);
    renderPlayer(detail);
    return detail;
  } catch (error) {
    setStatus(status, error.message || 'No fue posible cargar el video.', 'danger');
    const content = document.querySelector('[data-video-content]');
    if (content) {
      clearElement(content);
      content.appendChild(createCallout(error.message || 'No fue posible cargar el video.', 'danger'));
    }
    return null;
  } finally {
    setLoading(loader, false);
  }
}

export async function bootstrapVideoPage() {
  renderNavbar();

  const { status, loader, likeButton, commentForm, authGuard, commentStatus } = getElements();
  const videoId = getVideoId();
  const currentReturnTo = `${window.location.pathname}${window.location.search}`;

  if (!videoId) {
    setStatus(status, 'Falta el parámetro `id` en la URL.', 'danger');
    return;
  }

  const session = getSession();
  if (authGuard) {
    authGuard.hidden = Boolean(session);
    const loginLink = authGuard.querySelector('a');
    if (loginLink) {
      loginLink.href = `/pages/login.html?returnTo=${encodeURIComponent(currentReturnTo)}`;
    }
  }

  if (likeButton && !session) {
    likeButton.disabled = true;
  }

  if (commentForm && !session) {
    commentForm.hidden = true;
  }

  let currentDetail = await refreshVideo(videoId, status, loader);

  const syncLikeState = () => {
    if (!likeButton || !currentDetail) {
      return;
    }

    const sessionNow = getSession();
    const liked = sessionNow && Array.isArray(currentDetail.usuariosLikes)
      ? currentDetail.usuariosLikes.includes(sessionNow.carne)
      : false;

    likeButton.textContent = liked ? 'Quitar me gusta' : 'Me gusta';
    likeButton.dataset.state = liked ? 'liked' : 'unliked';
    likeButton.disabled = !sessionNow;
  };

  const refresh = async () => {
    currentDetail = await refreshVideo(videoId, status, loader);
    if (currentDetail) {
      syncLikeState();
      renderComments(currentDetail, getSession(), refresh);
    }
  };

  if (likeButton) {
    likeButton.addEventListener('click', async () => {
      const sessionNow = getSession();
      if (!sessionNow) {
        setStatus(status, 'Debes iniciar sesión para interactuar.', 'warning');
        return;
      }

      try {
        likeButton.disabled = true;
        await toggleLike(videoId, sessionNow.carne);
        await refresh();
      } catch (error) {
        setStatus(status, error.message || 'No fue posible actualizar el me gusta.', 'danger');
      } finally {
        likeButton.disabled = false;
      }
    });
  }

  if (commentForm) {
    commentForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const sessionNow = getSession();
      if (!sessionNow) {
        setStatus(commentStatus, 'Debes iniciar sesión para interactuar.', 'warning');
        return;
      }

      const field = commentForm.querySelector('[data-comment-text]');
      const texto = field.value.trim();

      if (!texto) {
        setStatus(commentStatus, 'El comentario no puede ir vacío.', 'warning');
        return;
      }

      try {
        const submit = commentForm.querySelector('button[type="submit"]');
        if (submit) {
          submit.disabled = true;
        }
        setStatus(commentStatus, 'Publicando comentario...', 'info');
        await createComment(videoId, { carne: sessionNow.carne, texto });
        field.value = '';
        setStatus(commentStatus, 'Comentario publicado exitosamente.', 'success');
        await refresh();
      } catch (error) {
        setStatus(commentStatus, error.message || 'No fue posible publicar el comentario.', 'danger');
      } finally {
        const submit = commentForm.querySelector('button[type="submit"]');
        if (submit) {
          submit.disabled = false;
        }
      }
    });
  }

  if (currentDetail) {
    syncLikeState();
    renderComments(currentDetail, getSession(), refresh);
  }
}

if (typeof document !== 'undefined') {
  const hasVideoPage = document.querySelector('[data-video-page]');
  if (hasVideoPage) {
    document.addEventListener('DOMContentLoaded', () => {
      bootstrapVideoPage();
    });
  }
}
