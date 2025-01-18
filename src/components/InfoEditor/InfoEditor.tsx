import styles from './InfoEditor.styles.module.css';
import React, { useState } from 'react';
import { Notation } from '@services/notationRenderer/Notation';

function SongInput() {
  const [formData, setFormData] = useState({ title: '', author: '' });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    Notation.getInstance().Title = formData.title;
    Notation.getInstance().Author = formData.author;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.form}
      noValidate>
      <div>
        <label className={styles.inputLabel}>Title:</label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={handleChange}
          className={styles.input}
        />
      </div>
      <div>
        <label className={styles.inputLabel}>Author:</label>
        <input
          type="text"
          id="author"
          value={formData.author}
          onChange={handleChange}
          className={styles.input}
        />
      </div>
      <button
        type="submit"
        className={styles.button}>
        Save
      </button>
    </form>
  );
}

export default SongInput;
