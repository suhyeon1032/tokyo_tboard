import { Box, Button, Divider, TextField, Typography, Paper, Stack, Alert } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchComments, createComments, deleteComments, updateComments } from '../../api/commentsApi';
import Loader from '../common/Loader';
import { useState } from 'react';
import ErrorMessage from '../common/ErrorMessage';
import { useMe } from '../../hooks/useMe';

function PostComments({ postId }) {
    const queryClient = useQueryClient();
    // 댓글 입력 상태 변수
    const [newComment, setNewComment] = useState("");
    // 댓글 수정 상태 변수
    const [editContent, setEditContent] = useState("");
    const [editId, setEditId] = useState(false); // true 수정, false 작성
    const { data: me, isLoading: meIsLoading } = useMe();
    const isMe = !meIsLoading && !!me;

    // TanStack Query =====================
    // 조회
    const {
        data: comments = [],
        isLoading: isCommentsLoading,
        isError: isCommentsError
    } = useQuery({
        queryKey: ['postComments', postId],
        queryFn: () => fetchComments(postId)
    });

    const checkEdit = (authorId) => {
        return (
            !meIsLoading &&
            me?.id != null &&
            authorId != null &&
            Number(me.id) === Number(authorId) //작성자 ID 로그인 ID 비교
        )
    }

    // 작성
    const createCommentMutation = useMutation({
        //content => key와 값이 같으면 생략해서 하나로 쓸 수 있음(content:content 라고 안해도 됨)
        mutationFn: (content) => createComments(postId, { content }),
        onSuccess: () => {
            setNewComment(''); // 작성 후 입력창 초기화
            queryClient.invalidateQueries({ queryKey: ['postComments', postId] });
        },
        onError: () => {
            alert('댓글 작성 실패');
        }

    }); // createCommentMutation.mutate() 메서드로 호출

    // 수정
    const updateCommentMutation = useMutation({
        mutationFn: ({ commentId, content }) => updateComments(postId, commentId, { content }),
        onSuccess: () => {
            setEditId(null);
            setEditContent("");
            queryClient.invalidateQueries({ queryKey: ['postComments', postId] });
        },
        onError: () => {
            alert('댓글 수정 실패');
        }
    });

    // 삭제
    const deleteCommentMutation = useMutation({
        mutationFn: (commentId) => deleteComments(postId, commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['postComments', postId] });
        },
        onError: () => {
            alert('댓글 삭제 실패');
        }
    });

    // Event Handlers =====================
    // 작성
    const handleNewComment = (evt) => {
        evt.preventDefault();
        if (!isMe) return;
        if (!newComment.trim()) return;

        createCommentMutation.mutate(newComment.trim());

    }

    // 삭제
    const handelDeleteComment = (commentId) => {
        const comment = comments.find((elem) => elem.id === commentId)
        if (!comment) return;
        if (!checkEdit(comment.author?.id)) {
            alert("본인의 댓글만 삭제할 수 있습니다.");
            return;
        }
        if (!window.confirm('댓글 삭제할거야?')) return;
        deleteCommentMutation.mutate(commentId);
    }

    // 수정 모드 진입
    const handelStartEdit = ({ id, content }) => {

        setEditId(id);// 수정 중으로 변경을 위한 변수 업데이트
        setEditContent(content);// 기존 내용 출력
    }

    // 수정 저장
    const handleSaveEdit = (commentId) => {

        if (!editContent.trim()) return;
        updateCommentMutation.mutate({ commentId, content: editContent.trim() })
    }

    // 수정 취소
    const handleCancelEdit = () => {
        setEditId(null);

    }

    return (
        <Box>
            <Typography variant='h6' sx={{ fontWeight: 600, mb: 1 }}>댓글</Typography>

            {isCommentsLoading && <Loader />}
            {isCommentsError && <ErrorMessage message='댓글 불러오기 실패' />}

            {/* 댓글 리스트 */}
            {!isCommentsLoading && !isCommentsError &&
                comments.map((comment) => {
                    const { id, content, createdAt, author } = comment;
                    // 본인 댓글 여부 확인

                    const loginedEdit = checkEdit(author?.id);

                    return (
                        <Paper key={id} variant='outlined' sx={{ p: 2, mb: 1.5 }}>
                            {
                                editId === id ? (
                                    /* === 수정 모드 === */
                                    <>
                                        <TextField
                                            fullWidth
                                            multiline
                                            size="small"
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)} // 입력 핸들러 연결
                                        />
                                        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 1 }}>
                                            <Button size="small" variant="contained" onClick={() => handleSaveEdit(id)}>저장</Button>
                                            <Button size="small" variant="outlined" color='inherit' onClick={handleCancelEdit}>취소</Button>
                                        </Stack>
                                    </>
                                ) : (
                                    /* === 일반 보기 모드 === */
                                    <>
                                        <Typography>{content}</Typography>

                                        {/*  본인 댓글일 대만 버튼 표시 */}


                                        <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                                            <Typography variant='caption'>
                                                {createdAt && new Date(createdAt).toLocaleString()}
                                            </Typography>
                                            {loginedEdit && (
                                                <Stack direction="row" spacing={0.8}>
                                                    {/* 함수 이름 handleStartEdit으로 수정 */}
                                                    <Button size="small" onClick={() => handelStartEdit(comment)}>수정</Button>
                                                    <Button size="small" color='error' onClick={() => handelDeleteComment(id)}> 삭제</Button>
                                                </Stack>
                                            )}
                                        </Stack>




                                    </>
                                )
                            }
                        </Paper>
                    )
                })}

            {/* 댓글 작성 폼  - 로그인 한 사람만*/}
            {
                isMe ? (
                    <>
                        <Box component="form" sx={{ my: 2 }} onSubmit={handleNewComment}>
                            <TextField label="댓글 작성" size='small' multiline minRows={2} fullWidth
                                value={newComment}
                                onChange={(evt) => setNewComment(evt.target.value)}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button type='submit' variant='contained' size='small'
                                    sx={{ borderRadius: 999, px: 1.5, mt: 1 }}>댓글 등록</Button>
                            </Box>
                        </Box>

                    </>
                ) : <Alert severity='info'>댓글을 작성하려면 로그인을 해주세요.</Alert>
            }
            <Divider sx={{ mb: 2 }} />
        </Box >
    );
}

export default PostComments;