import {useRecoilState,useRecoilValue} from 'recoil';
import {currentPageAtom,totalPagesAtom} from '../atoms';

import './Pagination.css';
type NumberOrStringArray = (number | string)[];

export const Pagination = () => {
    // Function to generate page numbers with ellipsis
    const [currentPage,setCurrentPage]=useRecoilState(currentPageAtom);
    const totalPages=useRecoilValue(totalPagesAtom); 
        
  const getPageNumbers = () => {
    const pageNumbers:NumberOrStringArray  = [];
    const DOTS = '...';
    
    // Always show first page
    pageNumbers.push(1);
    
    if (totalPages <= 5) {
      // If total pages is 5 or less, show all pages
      for (let i = 2; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show pages with ellipsis
      if (typeof currentPage==='number' && currentPage <= 3) {
        pageNumbers.push(2, 3, DOTS, totalPages);
      } else if (typeof currentPage==='number' && currentPage >= totalPages - 2) {
        pageNumbers.push(DOTS, totalPages - 2, totalPages - 1, totalPages);
      } else if(typeof currentPage==='number') {
        pageNumbers.push(
          DOTS,
          currentPage - 1,
          currentPage,
          currentPage + 1,
          DOTS,
          totalPages
        );
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className="pagination-container">
      {/* Previous button */}
      <button
        onClick={() => typeof currentPage==='number' && setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-button"
      >
        Previous
      </button>

      {/* Page numbers */}
      <div className="page-numbers">
        {getPageNumbers().map((pageNumber, index) => (
          <button
            key={index}
            onClick={() => pageNumber !== '...' && typeof pageNumber==='number' && setCurrentPage(pageNumber)}
            disabled={pageNumber === '...'}
            className={`page-number ${
              pageNumber === currentPage ? 'active' : ''
            } ${pageNumber === '...' ? 'dots' : ''}`}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      {/* Next button */}
      <button
        onClick={() => typeof currentPage==='number' && setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;

// export const Pagination = () => {
//   const [currentPage, setCurrentPage] = useRecoilState(currentPageAtom);
//   const totalPages = useRecoilValue(totalPagesAtom);
//     console.log("totalPages: "+totalPages);

//   const getPageNumbers = () => {
//     const pageNumbers: NumberOrStringArray = [];
//     const DOTS = '...';

//     pageNumbers.push(1);

//     if (totalPages <= 5) {
//       for (let i = 2; i <= totalPages; i++) {
//         pageNumbers.push(i);
//       }
//     } else {
//       if (typeof currentPage==='number' && currentPage <= 3) {
//         pageNumbers.push(2, 3, DOTS, totalPages);
//       } else if (typeof currentPage==='number' && currentPage >= totalPages - 2) {
//         pageNumbers.push(DOTS, totalPages - 2, totalPages - 1, totalPages);
//       } else if(typeof currentPage==='number') {
//         pageNumbers.push(
//           DOTS,
//           currentPage - 1,
//           currentPage,
//           currentPage + 1,
//           DOTS,
//           totalPages
//         );
//       }
//     }

//     return pageNumbers;
//   };

//   const handlePageChange = (newPage: number) => {
//     if (typeof newPage === 'number' && newPage !== currentPage) {
//       setCurrentPage(newPage);
//     }
//   };

//   return (
//     <div className="pagination">
//       <button
//         onClick={() => handlePageChange(Number(currentPage) - 1)}
//         disabled={currentPage === 1}
//         className="pagination-button"
//       >
//         Previous
//       </button>

//       {getPageNumbers().map((pageNumber, index) => (
//         <button
//           key={index}
//           onClick={() => pageNumber !== '...' && handlePageChange(Number(pageNumber))}
//           disabled={pageNumber === '...'}
//           className={`page-number ${
//             pageNumber === currentPage ? 'active' : ''
//           } ${pageNumber === '...' ? 'dots' : ''}`}
//         >
//           {pageNumber}
//         </button>
//       ))}

//       <button
//         onClick={() => handlePageChange(Number(currentPage) + 1)}
//         disabled={currentPage === totalPages}
//         className="pagination-button"
//       >
//         Next
//       </button>
//     </div>
//   );
// };

// export default Pagination;
