import React from "react";
import { FaArrowAltCircleLeft, FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { GoArrowDownLeft, GoArrowLeft } from "react-icons/go";
import {
  RiArrowDropLeftFill,
  RiArrowDropLeftLine,
  RiArrowDropRightLine,
} from "react-icons/ri";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center">
      <ul className="inline-flex items-center -space-x-px">
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className=" flex items-center text-sm py-2 px-3 leading-tight text-red-900 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
          >
            <RiArrowDropLeftLine width={12} height={12} />
            <p>Prev</p>
          </button>
        </li>
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => onPageChange(number)}
              className={`py-2 px-3 leading-tight border border-gray-300 ${
                number === currentPage
                  ? "text-red-900 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
                  : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
              }`}
            >
              {number}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center text-sm py-2 px-3 leading-tight text-red-900 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
          >
            <p>Next</p>
            <RiArrowDropRightLine width={12} height={12} />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
