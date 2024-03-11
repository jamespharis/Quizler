import fs from 'fs'
import { random } from 'underscore'


export const chooseRandom = (array = [], numItems) => {
  let arrayCopy = [...array] // create a copy of array so we won't mutate the original
  if (array === undefined || array.length<=1 || numItems < 1)  { return array } // if array & numItems input conditions are not met, return array
  else if (numItems === undefined || numItems > array.length || numItems <= 0 ) // if numItems is outside of correct range...
      { numItems = Math.floor(Math.random()*array.length) }                     // set it to a random number in the correct range
  let newArray = [] // create a new array to store the random, unique items from the original array
  for(let i =0; i< numItems; i++){ // create a for loop that will iterate #numItems times
    let randomIndex = Math.floor(Math.random()*arrayCopy.length) // create another variable that will be a random index of array
    newArray.push(arrayCopy[randomIndex]) // adds a random index of array into our new Array
    arrayCopy.splice(randomIndex,randomIndex) // removing the element from the copy array at randomIndex
  }
  return newArray
}



export const createPrompt = ({ numQuestions = 1, numChoices = 2 } = {}) => {
  const questionObject = questionNumber => ({ // RETURN AN ARRAY OF OBJECTS THROUGH THIS FORMATTING
    type: 'input',
    name: `question-${questionNumber}`,
    message: `Enter question ${questionNumber}`
  })
  const choiceObject = (choiceNumber, questionNumber) => ({
    type: 'input',
    name: `question-${questionNumber}-choice-${choiceNumber}`,
    message: `Enter answer choice ${choiceNumber} for question ${questionNumber}`
  })

  return Array(numQuestions + numQuestions * numChoices)
    .fill()
    .map((notRead, num) => {
      if(num % (numChoices + 1) === 0 ){ // If Even, 
        return questionObject(
          num / (numChoices + 1) ? num / (numChoices + 1) : 1)
      } else {
        return choiceObject(
          num % (numChoices + 1),
          Math.ceil(num / (numChoices + 1))
        )
      }
    })
}


export const createQuestions = (questionObject = {}) => {
  let questionKeys = Object.keys(questionObject)
  let questions = {}
  questionKeys.forEach(element => {
    if (!element.includes('choice')) {
      questions[element] = { // Repeated for the total number of questions
        type: 'list',
        name: element, 
        message: questionObject[element],
        choices: [] // Repeated for the total number of choices for each question
      }
    } else {
      let indexString = 'question-' + element.split('-')[1] // Created a string that with output our data as formatted
      let tempObj = questions[indexString]  // Push the String into an object, so we can add data (next step)
      tempObj['choices'].push(questionObject[element]) // adds element of questionObject into our 'choices' tempObject
    }
    return Object.values(questions)
  })
  return Object.values(questions)
}







export const readFile = path =>
  new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => (err ? reject(err) : resolve(data)))
  })

export const writeFile = (path, data) =>
  new Promise((resolve, reject) => {
    fs.writeFile(path, data, err =>
      err ? reject(err) : resolve('File saved successfully')
    )
  })
