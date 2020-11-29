import React, { useState } from 'react';
import {
  BugsContext,
  UserContext,
  CommentsContext,
} from 'src/context';
import BugsService from '../../services/bugs.service';

const AddBugs = (props) => {
  const { bugs } = React.useContext(BugsContext);
  const { app } = React.useContext(BugsContext);
  const { comments, getCommentsByBug } = React.useContext(
    CommentsContext,
  );
  const { userData } = React.useContext(UserContext);

  const [apps, setApps] = useState(null);
  const [bugName, setBugName] = useState(null);
  const [description, setDesc] = useState(null);
  const [theApp, setApp] = useState(null);

  //console.log(userData.userName) // user name
  if (apps === null) {
    const getApps = async () => {
      let appData = await BugsService.getAllApps();
      setApps(appData);
      setApp(appData.apps[0].app_name);
    };
    getApps();
  }

  // React.useEffect(() => {
  //   console.log('here')

  // }, [theApp]);

  const postBug = async () => {
    let newBug = {
      user_name: userData.userName,
      bug_name: bugName,
      description: description,
      app: theApp,
    };

    await BugsService.postNewBug(newBug);
    props.history.push('/dashboard');
  };

  console.log(theApp);

  const chooseApp = apps
    ? apps.apps.map((item) => {
        return (
          <option key={item.id} value={item.app_name}>
            {item.app_name}
          </option>
        );
      })
    : null;

  return (
    <div>
      <h3>Add your bug here!</h3>
      <form className="newBug">
        <select
          onChange={(ev) => {
            setApp(ev.currentTarget.value);
          }}
        >
          {chooseApp}
        </select>
        <label htmlFor="bugName">What is the bug?</label>
        <input
          id="bugName"
          onChange={(ev) => {
            setBugName(ev.currentTarget.value);
          }}
        ></input>
        <label htmlFor="bugDescription">
          Please describe the bug in detail
        </label>
        <textarea
          id="bugDescription"
          onChange={(ev) => {
            setDesc(ev.currentTarget.value);
          }}
        ></textarea>
        <button
          type="button"
          onClick={() => {
            postBug();
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddBugs;
