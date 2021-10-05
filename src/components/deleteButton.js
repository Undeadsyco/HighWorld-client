import { Button, Confirm, Icon } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { useState } from "react";

import { FETCH_POST_QUERY } from "../util/graphQL";

import MyPopup from "../util/myPopup";

const DeleteButton = (props) => {
  const { postId, callback, commentId } = props;
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT : DELETE_POST

  const [deletePostOrComment] = useMutation(mutation, {
    update: (proxy) => {
      setConfirmOpen(false);
      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_POST_QUERY
        })
        proxy.writeQuery({
          query: FETCH_POST_QUERY,
          data: {
            getPosts: data.getPosts.filter(p => p.id !== postId)
          }
        })
      }
      if (callback) callback()
    },
    variables: {
      postId,
      commentId
    }
  });

  return (
    <>
      <MyPopup
        content={commentId ? 'delete comment' : 'delete post'}
        children={
          <Button floated='right' as='div' color='red' onClick={() => setConfirmOpen(true)}>
            <Icon name='trash' style={{ margin: 0 }} />
          </Button>
        } 
      />
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrComment}
      />
    </>
  );
}

const DELETE_POST = gql`
  mutation deletePost($postId: ID!){
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!){
    deleteComment(postId: $postId, commentId: $commentId){
      id
      comments{
        id
        username
        body
        createdAt
      }
      commentCount
    }
  }
`

export default DeleteButton;