import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSortOrder, setSortField, sortBooks } from '../features/books/booksSlice';

const SortingOptions = () => {
  const dispatch = useDispatch();
  const { sortField, sortOrder } = useSelector((state) => state.books);

  const handleFieldChange = (e) => {
    dispatch(setSortField(e.target.value));
    dispatch(sortBooks());
  };

  const handleOrderChange = (e) => {
    dispatch(setSortOrder(e.target.value));
    dispatch(sortBooks());
  };

  return (
    <div>
      <label>
        Sort by:
        <select value={sortField} onChange={handleFieldChange}>
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="publisher">Publisher</option>
        </select>
      </label>
      <label>
        Order:
        <select value={sortOrder} onChange={handleOrderChange}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </label>
    </div>
  );
};

export default SortingOptions;
