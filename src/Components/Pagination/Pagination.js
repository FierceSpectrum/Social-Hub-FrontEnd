import './Pagination.scss';
import React from 'react';

const Pagination = ({ postsPerPage, totalPosts, paginate, setCurrentPage, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  const pagesToShow = 5; // Número de páginas intermedias que deseas mostrar
  const halfPagesToShow = Math.floor(pagesToShow / 2);

  let startPage = currentPage - halfPagesToShow > 1 ? currentPage - halfPagesToShow : 1;

  // Asegúrate de que endPage no exceda el número total de páginas
  let endPage = Math.min(startPage + pagesToShow - 1, pageNumbers.length);

  if (startPage + pagesToShow > pageNumbers.length) {
    startPage = Math.max(1, endPage - pagesToShow + 1);
  }

  function scrollToTop(number) {
    if (number !== currentPage) {
      paginate(number);
      setCurrentPage(number); // Actualizar el estado de la página actual
      window.scrollTo(0, 0);
    }
  }

  return (
    <nav>
      <ul className='pagination'>
        {!(pageNumbers.length === 0) ? (
          <>
            <li key={1} className='page-item'>
              <button
                onClick={() => scrollToTop(1)}
                className={`page-link ${1 === currentPage ? 'current-page' : ''}`}
              >
                1
              </button>
            </li>
            {pageNumbers.slice(startPage, endPage - 1).map(number => (
              <li key={number} className='page-item'>
                <button
                  onClick={() => scrollToTop(number)}
                  className={`page-link ${number === currentPage ? 'current-page' : ''}`}
                >
                  {number}
                </button>
              </li>
            ))}
            {!(pageNumbers.length === 1) ? (
              <li key={pageNumbers.length} className='page-item'>
                <button
                  onClick={() => scrollToTop(pageNumbers.length)}
                  className={`page-link ${pageNumbers.length === currentPage ? 'current-page' : ''}`}
                >
                  {pageNumbers.length}
                </button>
              </li>
            ) : null}
          </>
        ) : null}
      </ul>
    </nav>

  );
};

export default Pagination;
