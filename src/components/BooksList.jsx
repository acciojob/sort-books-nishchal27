import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBooks, sortBooks } from '../features/books/booksSlice';
import SortingOptions from './SortingOptions';

const BooksList = () => {
  const dispatch = useDispatch();
  const { books, status, error } = useSelector((state) => state.books);
  const [searchTerm, setSearchTerm] = useState('javascript');


  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchBooks(searchTerm));
  };

  return (
    <div>
      <h1>Books</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for books..."
        />
        <button type="submit">Search</button>
      </form>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p>Error: {error}</p>}
      {status === 'succeeded' && (
        <>
          <SortingOptions />
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Publisher</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <tr key={index}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.publisher}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default BooksList;
