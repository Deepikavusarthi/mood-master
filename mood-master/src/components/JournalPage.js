// components/JournalPage.js
import React, { useState } from "react";

const JournalPage = () => {
  const [entry, setEntry] = useState("");

  return (
    <div>
      <h2>Daily Journal</h2>
      <textarea
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        rows="10"
        cols="50"
        placeholder="Write about your day..."
      />
      <button>Save Entry</button>
    </div>
  );
};

export default JournalPage;
