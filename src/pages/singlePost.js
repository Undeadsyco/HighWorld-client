import { useContext, useRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import moment from "moment";
import { Button, Card, Form, Grid, Icon, Image, Label } from "semantic-ui-react";

import { AuthContext } from "../context/auth";

import DeleteButton from "../components/deleteButton";
import LikeButton from "../components/likeButton";
import MyPopup from "../util/myPopup";

const SinglePost = (props) => {
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);

  const commentInputRef = useRef(null)

  const [comment, setComment] = useState('');

  const { data } = useQuery(FETCH_POST, {
    variables: {
      postId
    }
  });

  const [createComment] = useMutation(CREATE_COMMENT, {
    update: () => {
      setComment('')
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment
    }
  });

  function deletePostCallback() {
    props.history.push('/')
  }

  let postMarkup;
  if (!data) {
    postMarkup = <p>Loading Post...</p>
  } else {
    const { getPost: { id, body, createdAt, username, comments, likes, likeCount, commentCount } } = data;

    postMarkup = (
      <Grid style={{ marginTop: 10 }}>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              floated='right'
              size='small'
              src='https://react.semantic-ui.com/images/avatar/large/molly.png'
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <MyPopup
                  content='comment on post'
                  children={
                    <Button as='div' labelPosition='right' onClick={() => console.log('comment on post')}>
                      <Button basic color='blue'>
                        <Icon name='comments' />
                      </Button>
                      <Label basic color='blue' pointing='left'>
                        {commentCount}
                      </Label>
                    </Button>
                  }
                />
                {user && user.username === username && <DeleteButton postId={id} callback={deletePostCallback} />}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className='ui action input fluid'>
                      <input
                        type='text'
                        placeholder='comment...'
                        name='comment'
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        type='submit'
                        className='ui button teal'
                        disabled={comment.trim() === ''}
                        onClick={createComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map(comment => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && <DeleteButton postId={id} commentId={comment.id} />}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }

  return postMarkup
}

const FETCH_POST = gql`
  query fetchPost($postId: ID!){
    getPost(postId: $postId){
      id
      username
      body
      createdAt
      likes{
        username
      }
      likeCount
      comments{
        id
        username
        body
        createdAt
      }
      commentCount
    }
  }
`;

const CREATE_COMMENT = gql`
  mutation createComment($postId: ID!, $body: String!){
    createComment(postId: $postId, body: $body){
      id
      comments{
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`

export default SinglePost;