Here’s a clean React 18-compatible snippet using `useEffect` and `setInterval` to fetch data every 30 seconds:

    ```jsx
import React, { useEffect, useState } from 'react';

const DataFetcher = () => {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch('https://api.example.com/data');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('API fetch failed:', error);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch
    const intervalId = setInterval(fetchData, 30000); // Fetch every 30 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <div>
      <h2>Fetched Data:</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default DataFetcher;
```

### 🔍 Key Points:
    - `useEffect` ensures the interval starts when the component mounts.
- `setInterval` triggers `fetchData` every 30,000 milliseconds.
- `clearInterval` prevents memory leaks when the component unmounts.
- You can enhance this with `AbortController` for fetch cancellation or `useRef` for tracking stale closures.

    Let me know if you want to add loading states, error handling UI, or integrate this with `useTransition` for smoother updates.