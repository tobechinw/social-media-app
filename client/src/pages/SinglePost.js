import React, {useContext, useRef, useState} from "react";
import gql from "graphql-tag";
import {useMutation, useQuery} from "@apollo/react-hooks";
import {Button, Card, Form, Grid, Icon, Image, Input, Label, Popup} from "semantic-ui-react";
import moment from "moment";
import LikeButton from "../components/LikeButton";
import {AuthContext} from "../context/auth";
import DeleteButton from "../components/DeleteButton";



function SinglePost(props){
    const postId= props.match.params.postId;
    const {user}= useContext(AuthContext);

    const commentInputRef= useRef(null);

    const [comment, setComment]= useState('');
    const {loading, error, data }= useQuery(FETCH_POST_QUERY, {variables: {postId} });

    const[submitComment]= useMutation(CREATE_COMMENT_MUTATION, {
        update(){
            setComment('');
            commentInputRef.current.blur();
        },
        variables: {postId, body: comment}
    })


    if(loading){
        return 'loading...';
    }
    if (error) return 'error...'




    function deletePostCallback(){
        props.history.push('/');
    }




    let postMarkup;



    if(!data.getPost){
        postMarkup= <p className="loading"/>
    }else{
        const {id, body, createdAt, comments, username, commentCount,likes, likeCount}= data.getPost;


        postMarkup= (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image src='https://react.semantic-ui.com/images/avatar/large/molly.png' size={"small"} floated={"right"}/>
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr/>
                            <Card.Content extra>
                                <LikeButton user={user} post={{id, likeCount, likes}}/>
                                <Popup content="Comment on post" inverted trigger={
                                    <Button as={"div"} labelPosition={"right"} onClick={()=> console.log('comment on post')}>
                                        <Button basic color="blue">
                                            <Icon name={"comments"}/>
                                        </Button>
                                        <Label basic color={"blue"} pointing="left">
                                            {commentCount}
                                        </Label>
                                    </Button>
                                }/>
                                {user && user.username===username&& (
                                    <DeleteButton postId={id} callback={deletePostCallback} />
                                )}
                            </Card.Content>
                        </Card>
                        {user && (
                            <Card fluid>
                                <Card.Content>
                                    <p>Post a comment</p>
                                    <Form>
                                        <div className="ui action input fluid">
                                            <input type={"text"} placeholder="Comment..." name={"comment"} value={comment} onChange={event=> setComment(event.target.value)}
                                            ref={commentInputRef}
                                            />
                                            <button type="submit" className="ui button blue" disabled={comment.trim()===''} onClick={submitComment}> Post comment</button>
                                        </div>
                                    </Form>
                                </Card.Content>
                            </Card>)}
                        {comments.map(comment=>(
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    {user && user.username=== comment.username && (
                                        <DeleteButton postId={id} commentId={comment.id}/>
                                    )}
                                    <Card.Header>{comment.username}</Card.Header>
                                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                    <Card.Description>{comment.body}</Card.Description>
                                </Card.Content>
                            </Card>
                            )
                        )}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }

    return postMarkup;

}



const CREATE_COMMENT_MUTATION= gql`
    mutation($postId: ID!, $body: String!){
        createComment(postId: $postId, body: $body){
            id
            comments{
                id
                body
                createdAt
                username
            }
            commentCount
        }
    }
`

const FETCH_POST_QUERY= gql`
    query($postId: ID!){
        getPost(postId: $postId){
            id
            body
            createdAt
            username
            likeCount
            likes{
                username
            }
            commentCount
            comments{
                id
                username
                createdAt
                body
            }
        }
    }
`


export default SinglePost;