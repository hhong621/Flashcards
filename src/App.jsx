import { useCallback, useState } from 'react'
import { useEffect } from 'react'
import Header from './components/Header'
import NavButton from './components/NavButton'
import Card from './components/Card'
import Counter from './components/Counter'
import Toast from './components/Toast'
import Modal from './components/Modal'
import table from './assets/table-setup.png'
import './App.css'

/**
 * TO DO
 * - aria-live and screen reader accessibility
 * - prefers-reduced-motion
 * - counter error handling
 * - better error handling for file format
 * - exit animations
 */

function App() {
  // Load sample data only when App first mounts
  useEffect(() => {
    firstLoad();
  }, []);

  // Variables and States ---
  const [cardsData, setCardsData] = useState([]);
  const [originalCardsData, setOriginalCardsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [frontText, setFrontText] = useState("");
  const [backText, setBackText] = useState("");
  const [prevDisabled, setPrevDisabled] = useState(false);
  const [nextDisabled, setNextDisabled] = useState(false);
  const [shuffleToastActive, setShuffleToastActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startSide, setStartSide] = useState("Term");
  const [frontKey, setFrontKey] = useState("Term"); // if we want this to be from the file, will have to be state
  const [backKey, setBackKey] = useState("Definition");

  // Functions ---
  /**
   * Load the sample data from .csv file
   */
  async function firstLoad() {
    try {
        const response = await fetch('data/flashcard_test.csv');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvText = await response.text();
        const parsedData = await parseData(csvText);
        setOriginalCardsData([...parsedData]);
        setCardsData([...parsedData]);
        initialize();
    }
    catch {
      console.error("Failed to load flashcards:", error);
      setFrontText("(-_-') card error");
      setBackText("('-_-) failed to load");
      disableNavButtons();
    }
  }

  /**
   * Fetch flashcard data from CSV file and parse the data
   */
  async function parseData(csvText) {
    try {
      const rows = csvText.trim().split('\n');
      const csvSplitRegex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
      const headers = rows[0].split(csvSplitRegex).map(header => header.trim().replace(/"/g, ''));
      // frontKey = headers[0];
      // backKey = headers[1];

      const parsedData = rows.slice(1).map(row => {
        const values = row.split(csvSplitRegex).map(value => value.trim().replace(/"/g, ''));
        const card = {};
        headers.forEach((header, index) => {
          card[header] = values[index];
        });
        return card;
      });

      return parsedData;
    }
    catch (error) {
      console.error("Failed to load flashcards:", error);
      setFrontText("(-_-') card error");
      setBackText("('-_-) failed to load");
      disableNavButtons();
    }
  }

  /**
   * Set the starting state of variables and display
   */
  function initialize() {
    setCurrentIndex(0);
    setIsFlipped(false);
    setCardSides();
    displayCard();
    updateNavButtons();
  }

  // Update display when currentIndex changes
  useEffect(() => {
    displayCard();
  }, [currentIndex, cardsData]);

  /**
   * Render the current index card data, handle errors
   */
  function displayCard() {
    if (cardsData.length === 0 || currentIndex < 0 || currentIndex >= cardsData.length) {
      console.warn("No card to display or index out of bounds.");
      setFrontText("(-_-') card error");
      setBackText("('-_-) no card or index out of bounds");
      return;
    }

    const currentCard = cardsData[currentIndex];
    
    setTimeout(() => {
      setFrontText(currentCard[frontKey]);
      setBackText(currentCard[backKey]);
    }, 150);

    updateNavButtons();

    console.log(currentIndex);
    console.log(currentCard[frontKey]);
    console.log(currentCard[backKey]);

    if (isFlipped) { // should this get moved to next back buttons?
      flipCard();
    }
  }

  /**
   * Toggles "flipped" class for the card
   */
  function flipCard() {
    setIsFlipped(prevIsFlipped => !prevIsFlipped);
  }
  
  /**
   * Disable prev button when first card and next button when last card
   */
  function updateNavButtons() {
    if (currentIndex === 0) {
      setPrevDisabled(true);
      setNextDisabled(false);
    }
    else if (currentIndex === cardsData.length - 1) {
      setPrevDisabled(false);
      setNextDisabled(true);
    }
    else {
      setPrevDisabled(false);
      setNextDisabled(false);
    }
  }

  /**
   * Disabled both nav buttons, helper function for read error
   */
  function disableNavButtons() {
    setPrevDisabled(true);
    setNextDisabled(true);
  }

  /**
   * Advance to the next card if available
   */
  function nextCard() {
    if (currentIndex < cardsData.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  }

  /**
   * Go back to previous card if available
   */
  function prevCard() {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  }

  /**
   * Set startSide state to "Term"
   */
  function setStartToTerm() {
    setStartSide("Term");
  }

  /**
   * Set startSide state to "Definition"
   */
  function setStartToDefinition() {
    setStartSide("Definition");
  }

  // Watch for change in startSide and call setCardSides()
  useEffect(() => {
    setCardSides();
  }, [startSide]);

  /**
   * Update the frontKey and backKey values based on the startSide
   */
  function setCardSides() {
    if (startSide === "Term") {
      setFrontKey("Term");
      setBackKey("Definition");
    } 
    else if (startSide === "Definition") {
      setFrontKey("Definition");
      setBackKey("Term");
    }
  }

  /**
   * Shuffle cards and reset to first card
   */
  function shuffleCards() {
    let tempCards = cardsData;

    for (let i = cardsData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tempCards[i], tempCards[j]] = [tempCards[j], tempCards[i]];
    }

    setCardsData([...tempCards]);
    initialize();
    console.log("Cards shuffled");
    setShuffleToastActive(true);
  } 

  /**
   * Signal the toast element to unmount
   */
  function dismissToast () {
    setShuffleToastActive(false);
  }

  /**
   * Open file upload modal
   */
  function openModal() {
    setIsModalOpen(true);
  }

  /**
   * Close file upload modal
   */
  function closeModal() {
    setIsModalOpen(false);
  }

  /**
   * Handle new file upload and reset to initial state
   */
  function uploadFile(event) {
    closeModal();
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        console.log("hi");
        try {
          const text = e.target.result;
          const parsedData = await parseData(text);
          setOriginalCardsData([...parsedData]);
          setCardsData([...parsedData]);
          initialize();
        }
        catch (error) {
          console.error("Error while processing file:", error);
        }
      };
      
      reader.onerror = () => {
        console.log("Failed to read file");
      }

      reader.readAsText(file);
    }

    event.target.value=null; // reset so that same file can be uploaded twice
  }

  /**
   * Helper function to block arrow keys from advancing card when radio buttons are focused
   * @returns is either radio button focused
   */
  function isToggleFocused() {
    const focusLeft = document.activeElement === document.getElementById("startTerm");
    const focusRight = document.activeElement === document.getElementById("startDefinition");
    return focusLeft || focusRight;
  }

  /**
   * Callback that handles what function each arrow key press should do
   */
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      flipCard();
    }
    else if (!isToggleFocused() && (event.key === 'ArrowRight' && currentIndex < cardsData.length - 1)) {
      nextCard();
    }
    else if (!isToggleFocused() && (event.key === 'ArrowLeft' && currentIndex > 0)) {
      prevCard();
    }
  }, [currentIndex, cardsData]);

  /**
   * Effect that listens for keydown change
   */
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <>
      <Header
        uploadFunction={openModal}
        toggleFunction1={setStartToTerm}
        toggleFunction2={setStartToDefinition}
        shuffleFunction={shuffleCards}
      />
      <main>
        <NavButton 
          icon="chevron_backward" 
          style={{ paddingLeft: '7px', fontSize: "48px" }} 
          onClick={prevCard}
          isdisabled={prevDisabled ? true : ""}
        />
        <div className='card-container'>
          <Card
            id="card"
            isFlipped={isFlipped ? "flipped" : ""}
            frontText={frontText}
            backText={backText}
            onClick={flipCard}
          />
        </div>
        <NavButton 
          icon="chevron_forward" 
          style={{ paddingLeft: '11px', fontSize: "48px" }} 
          onClick={nextCard}
          isdisabled={nextDisabled ? true : ""}
        />
      </main>
      <Counter
        currentNum={currentIndex + 1}
        total={cardsData.length}
      />
      <Toast
        isActive={shuffleToastActive}
        label={"Cards Shuffled"}
        icon={"shuffle"}
        dismiss={dismissToast}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <div className="modal-header">
            <h3>Upload File</h3>
            <button 
              className='iconButton' 
              aria-label='Close file upload'
              onClick={closeModal} 
            >
              <span 
                className="material-symbols-rounded" 
                style={{cursor:"pointer", fontSize:"1.5em"}}
              >
                close
              </span>
            </button>
            
        </div>
        <p>Must be a .csv file that is formatted with Term and Definition as the headers. An easy way is to export a spreadsheet that looks like this example:</p>
        <img src={table}></img>
        <p>Note: If your Term or Definition contains a comma, surround it in double quotation marks ("").</p>
        <label 
          htmlFor="file-input" 
          className='custom-file-input'
        >
          Choose File
          <input 
            type="file" 
            id="file-input" 
            name="file-input" 
            accept='.csv' 
            onChange={uploadFile}
          ></input>
        </label>
        
      </Modal>
    </>
  )
}

export default App
