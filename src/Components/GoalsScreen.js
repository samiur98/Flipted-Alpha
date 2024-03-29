import React, { useState  } from 'react';
import "./GoalsScreen.css";

//This component is used to display the main part of the goals screen
function GoalsScreen() {

  //used by the form as a new goal is built
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState([]);
  const [subgoals, setSubgoals] = useState([]);

  //used by the form as a new subgoal is built
  const [subName, setSubName] = useState('');
  const [subDate, setSubDate] = useState('');

  //used to filter goals
  const [searchTag, setSearchTag] = useState('');

  //the main fake data
  const [goals, setGoals] = useState(
    [
      {id: "0", name: "Goal 1", done: false, starred: false, goal: "Just do it.", duedate: "00/00/00", tags: ['tag1', 'tag2'], owner: "testuser", assignee: "testuser", open: false, subgoals: 
        [
          {id: "0", name: "SubGoal 1", done: false, goal: "Just do it.", duedate: "00/00/00"},
          {id: "1", name: "SubGoal 2", done: true, goal: "Inspiring text", duedate: "00/00/00"},
          {id: "2", name: "SubGoal 3", done: false, goal: "Yet another task", duedate: "00/00/00"},
        ]
      }, 
      {id: "1", name: "Goal 2", done: false, starred: true, goal: "Just do it.", duedate: "00/00/00", tags: ['tag2', 'tag3'], owner: "testuser", assignee: "testuser", open: true, subgoals: 
        [
          {id: "0", name: "SubGoal 1", done: false, goal: "Just do it.", duedate: "00/00/00"},
          {id: "1", name: "SubGoal 2", done: true, goal: "Inspiring text", duedate: "00/00/00"},
          {id: "2", name: "SubGoal 3", done: false, goal: "Yet another task", duedate: "00/00/00"},
        ]
      },
      {id: "2", name: "Goal 3", done: false, starred: false, goal: "Just do it.", duedate: "00/00/00", tags: ['tag2', 'tag3'], owner: "testuser", assignee: "testuser", open: true, subgoals: 
        [
          {id: "0", name: "SubGoal 1", done: false, goal: "Just do it.", duedate: "00/00/00"},
          {id: "1", name: "SubGoal 2", done: false, goal: "Inspiring text", duedate: "00/00/00"},
          {id: "2", name: "SubGoal 3", done: false, goal: "Yet another task", duedate: "00/00/00"},
        ]
      }
    ]);

  //this keeps track of all tags so that they can be displayed in the filtering section
  const [allTags, setAllTags] = useState(getAllTags());

  const [newGoalOpen, setNewGoalOpen] = useState(false);

  const handleAddGoal = (event) => {
    event.preventDefault();
    setGoals([...goals, {id: goals.length, name: name, done: false, starred: false, goal: goal, duedate: "00/00/00", tags: tags, owner: "testuser", assignee: "testuser", open: false, subgoals: subgoals} ]);
    goals.push({id: goals.length, name: name, done: false, starred: false, goal: goal, duedate: "00/00/00", tags: tags, owner: "testuser", assignee: "testuser", open: false, subgoals: subgoals});
    setName('');
    setGoal('');
    setTags([]);
    setSubgoals([]);
    setAllTags(() =>getAllTags());
    setNewGoalOpen(false);
  }

  function getAllTags() {
    //using a set to avoid adding duplicate values
    let temptags = new Set();
    for (var i=0; i<goals.length; i++)
      for (var ii = 0; ii < goals[i].tags.length; ii++)
        temptags.add(goals[i].tags[ii]);

    return Array.from(temptags);
  }

  //dropdown for the list of all available tags
  function DropDown() {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <button type="button" className="dropdownArrowButton" onClick={()=>setOpen(!open)}>v</button>
        <br/>
        {open ? (<DisplayDropDownList/>) : null}
      </div>);

}

  function DisplayDropDownList(){
    return(
      <div>
        {allTags.map((tag, i)=>(
        <button type="button" className="dropdownItem" key={i} onClick={()=>setSearchTag(tag)}>{tag}</button>
        ))}
      </div>
    )
  }

  function handleAddTag() {
    setTags(tags.concat(tag));
    setTag('');
  }

  function handleAddSubgoal() {
    setSubgoals([...subgoals, {id: subgoals.length, name: subName, done: false, goal: 'n/a', duedate: subDate}]);
    setSubName('');
    setSubDate('');
  }

  function handleCompleteGoal(goalId, subgoalId) {
    goals[goalId].subgoals[subgoalId].done = !goals[goalId].subgoals[subgoalId].done;
    setGoals([...goals]);
  }

  function handleStarGoal(goalId) {
    goals[goalId].starred = !goals[goalId].starred;
    setGoals([...goals]);
  }

  function handleOpenGoal(goalId) {
    goals[goalId].open = !goals[goalId].open;
    setGoals([...goals]);
  }

  //displays a list of subgoals
  function SubGoalList(props) {
    return props.g.subgoals.map((subg) => (
      <SubGoal key={subg.id} sg={subg} goalId={props.g.id}/>
    ));
  }

  //displays one goal
  function Goal(props){
      return(
        <div className="goal">
          <div className="goalGrid">
            <button className="arrowButton" onClick={() => handleOpenGoal(props.g.id)}>{props.g.open ? "v" : ">" }</button>
            <h1 >{props.g.name}</h1>
            <button className="checkButton" courseid={props.g.id} onClick={() => handleStarGoal(props.g.id)}>{props.g.starred ? "⭐" : ""}</button>
          </div>
          {props.g.open ? (<SubGoalList g={props.g}/>) : null }
        </div>
      );
  }

  //displays a list of goals
  function StarredGoalList() {
    return goals.filter(({tags, starred}) => {return (tags.includes(searchTag) || searchTag === '') && starred;}).map((goal) => (
      <Goal key={goal.id} g={goal}/>
    ));
  }

  function UnstarredGoalList() {
    return goals.filter(({tags, starred}) => {return (tags.includes(searchTag) || searchTag === '') && !starred;}).map((goal) => (
      <Goal key={goal.id} g={goal}/>
    ));
  }

  //displays one subgoal
  function SubGoal(props){
    return(
      <div className={props.sg.done ? "subGoalDone" : "subGoal"}>
        <h1>{props.sg.name}</h1>
        <p>{"due: "+props.sg.duedate}</p>
        <button className="checkButton" courseid={props.sg.id} onClick={() => handleCompleteGoal(props.goalId, props.sg.id)}>{props.sg.done ? "✅" : ""}</button>
      </div>
      
    );
  }

  function NewGoalForm() {
    return (
        <form data-testid="test2" className="newGoalForm" onSubmit={handleAddGoal}>
          <h3 >Add Goal</h3>
          <label className="textInput"> Name: </label>
          <input type="text" id="cname" name="cname" value={name} onChange={event => setName(event.target.value)}/>
          <br />

          <label className="textInput"> Goal: </label>
          <input type="text" id="cname" name="cname" value={goal} onChange={event => setGoal(event.target.value)}/>
          <br />
          
          <label className="textInput"> Tag: </label>
          <input type="text" id="cname" name="cname" value={tag} onChange={event => setTag(event.target.value)}/>
          <button type="button" onClick={handleAddTag}>add tag</button>

          <div >
            {tags.map((tag, i)=>(
            <p key={i}>{tag}</p>
            ))}
          </div>
          
          <label className="textInput"> Subgoal: </label>
          <input type="text" id="cname" name="cname" value={subName} onChange={event => setSubName(event.target.value)}/>
          <label className="textInput"> Due date: </label>
          <input type="text" id="cname" name="cname" value={subDate} onChange={event => setSubDate(event.target.value)}/>
          <button type="button" onClick={handleAddSubgoal}>add subgoal</button>
          

          <div>
            {subgoals.map((subgoal, i)=>(
            <p key={i}>{subgoal.name}</p>
            ))}
          </div>

          <button type="submit" className="submitbutton">Submit</button>
        </form>
    )
  }

  function GoalsDisplay() {
    return (
      <div className="mainContainer">
        <h1 data-testid="test1" className="pageTitle">Goals</h1>
        <button type="button" className="newGoalButton" onClick={()=>setNewGoalOpen(true)}>New Goal</button>
        <div className="filterBar">
          <h3>Filter by tag:</h3>
          <div>
            <input type="text" value={searchTag} onChange={event => setSearchTag(event.target.value)}/>
            <DropDown/>
          </div>
        </div>

        <StarredGoalList/>
        <UnstarredGoalList/>

      </div>
    );
  }

  function NewGoalFormDisplay() {
    return(
      <div className="popupContainer">
        <div className="newGoalForm">
          <NewGoalForm/>
          <button type="button" onClick={()=>setNewGoalOpen(false)}>close</button>
        </div>
      </div>
    );
  }

    return (
      <div className="mainGoalsPage">   
        {newGoalOpen ? (<NewGoalFormDisplay key="form"/>) : (<GoalsDisplay key="goals"/>)}
      </div>
    );
}

export default GoalsScreen;
