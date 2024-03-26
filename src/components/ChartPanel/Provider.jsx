import React, { useRef, useState, useEffect } from 'react';
import ResizeObserver from "resize-observer-polyfill";

// Create a React context to hold the observed dimensions
const ReactDims = React.createContext(null);

// Custom hook to observe the dimensions of a DOM element using ResizeObserver
const useResizeObserver = ref => {
  // State to hold the observed dimensions
  const [dimensions, setDimensions] = useState(null);

  // Effect to set up ResizeObserver and observe changes in dimensions
  useEffect(() => {
    // Get the target element to observe
    const observeTarget = ref.current;
    
    // Create a new ResizeObserver instance
    const resizeObserver = new ResizeObserver(entries => {
      // For each observer entry, update the dimensions state
      entries.forEach(entry => {
        setDimensions(entry.contentRect);
      });
    });

    // Start observing the target element
    resizeObserver.observe(observeTarget);

    // Cleanup function to stop observing when component unmounts or ref changes
    return () => {
      resizeObserver.unobserve(observeTarget);
    };
  }, [ref]); // Depend on ref to re-run effect when ref changes

  // Return the observed dimensions
  return dimensions;
};

// Provider component to wrap children and provide observed dimensions
export const Provider = (props) => {
  // Ref to hold the target element for observation
  const wrapperRef = useRef();

  // Get dimensions using the custom hook
  const dimensions = useResizeObserver(wrapperRef);

  // Render the provider with the observed dimensions
  return (
    <div ref={wrapperRef} style={{ height: '100%' }}>
      <ReactDims.Provider value={dimensions}>
        {props.children}
      </ReactDims.Provider>
    </div>
  );
};

// Higher-order component (HOC) to inject observed dimensions into a child component
export const withContext = (ChildComponent) => {
  return (props) => (
    <ReactDims.Consumer>
      {(incomingDims) => (<ChildComponent {...props} dims={incomingDims} />)}
    </ReactDims.Consumer>
  );
};
