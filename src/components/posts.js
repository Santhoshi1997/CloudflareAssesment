import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import Modal from 'react-modal';
import _ from "lodash";

const Container = styled.div`
  background: #36393e;
  display: flex;
  justify-content: center; // 1
  flex-flow: column wrap; // 2
  width: 100%;
  height: 100%;
`;

const List = styled.div`
  display: flex;
  justify-content: center; // 3
  flex-flow: row wrap; // 4
`;

const Card = styled.div`
  margin: 20px;
  background: #fff;
  height: 400px;
  width: 400px;
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-flow: column; // 5 
  justify-content: center;
  align-items: center;
`;

const CardItems = styled.div`
margin: 20px;
background: #fff;
justify-content: center;
align-items: center;
`;

const ItemContainer = styled.div`
margin: 20px;
background: #fff;
text-align: center;
`;

const Button = styled.button`
  background-color: black;
  color: white;
  font-size: 20px;
  padding: 10px 60px;
  border-radius: 5px;
  margin: 10px 0px;
  cursor: pointer;
`;

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [username, setUsername] = useState("");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  const getPosts = async () => {
    fetch("https://my-worker.santhoshineeraja.workers.dev/posts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    })
      .then(res => res.json())
      .then(
        (result) => {
          const body = _.get(result, 'body.Posts', []);
          setPosts(body);
        },
        (error) => {
          console.log("Error: ", error);
          setPosts([]);
        }
      )
  };

  useEffect(() => {
    getPosts();
  }, []);

  function openModal() {
    setUsername("");
    setTitle("");
    setContent("");
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function submitPost() {
    console.log("Username: ", username);
    console.log("Submit Modal");
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, username, content })
    };
    fetch("https://my-worker.santhoshineeraja.workers.dev/posts", requestOptions)
      .then(res => res.json())
      .then(
        (result) => {
          alert("Successfully added the post");
          getPosts();
        },
        (error) => {
          console.log("Error: ", error);
        }
      );
    closeModal();
  }

  function changeUserName(event) {
    setUsername(event.target.value);
  }

  function changeTitle(event) {
    setTitle(event.target.value);
  }

  function changeContent(event) {
    setContent(event.target.value);
  }

  return (
    <div key={1}>
      <div style={{ "display": "flex", "justifyContent": "space-between" }}>
        <h1 style={{ "textAlign": "center" }}>CloudGram</h1>
        <Button onClick={openModal}>
          Add Post
        </Button>
      </div>
      <Container>
        <List>
          {posts.map(item =>
            <Card key={item.title}>
              <CardItems>
                <ItemContainer>
                  {item.title + "\n"}
                </ItemContainer>
                <ItemContainer>
                  {item.username + "\n"}
                </ItemContainer>
                <ItemContainer>
                  {item.content + "\n"}
                </ItemContainer>
              </CardItems>
            </Card>)}
        </List>
      </Container>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        ariaHideApp={false}
        contentLabel="Example Modal"
      >
        <h2 style={{ "textAlign": "center" }}>Add Post</h2>
        <div style={{ "flex": 1, "display": "flex", "justifyContent": "center", "alignItems": "center" }}>
          <form style={{ "display": "flex", "flexFlow": "column wrap" }}>
            <div style={{ "display": "flex", "flexFlow": "row wrap", "margin": 10, "justifyContent": "space-between" }}>
              <label style={{ "margin": 10 }}>Username </label>
              <textarea value={username} onChange={(e) => changeUserName(e)} />
            </div>
            <div style={{ "display": "flex", "flexFlow": "row wrap", "margin": 10, "justifyContent": "space-between" }}>
              <label style={{ "margin": 10 }}>Title </label>
              <textarea value={title} onChange={(e) => changeTitle(e)} />
            </div>
            <div style={{ "display": "flex", "flexFlow": "row wrap", "margin": 10, "justifyContent": "space-between" }}>
              <label style={{ "margin": 10 }}>Content </label>
              <textarea value={content} onChange={(e) => changeContent(e)} rows={10} />
            </div>
          </form>
        </div>
        <div style={{ "display": "flex", "justifyContent": "space-between" }}>
          <Button onClick={closeModal}>Close</Button>
          <Button onClick={submitPost}>Submit</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Posts;