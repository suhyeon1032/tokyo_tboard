import { Box, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { register } from '../../api/authApi';
import { useNavigate } from 'react-router';

function RegisterPage() {

    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        nickname: "",
        password: "",
        rePassword: ""
    });

    const registerMutation = useMutation({
        mutationFn: register,
        onSuccess: () => navigate("/posts")
    });

    // 이벤트 핸들러
    // 
    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setForm((prev) => ({ ...prev, [name]: value })); // ...prev 스프레드 연산자 // 이전 상태 복사 후 변경된 필드만 업데이트
    }

    // submit 버튼 눌렀을 때 동작
    const handleSubmit = (evt) => {
        evt.preventDefault();

        if (form.password !== form.rePassword) {
            alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            return;
        }

        registerMutation.mutate({ // authApi > register에서 넘기는 순서랑 같아야 함
            email: form.email.trim(),
            password: form.password,
            nickname: form.nickname.trim()
        });
    }

    return (
        <Container maxWidth="sm">
            <Paper elevation={0}
                sx={{
                    width: '100%',
                    borderRadius: 3,
                    p: 4,
                    boxShadow: '0 16px 45px rgba(0,0,0,0.06)'
                }} >
                {/* 상단 제목 */}
                <Typography variant='h5' sx={{ fontWeight: 600, fontSize: 24 }}>회원가입</Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField type='email' label="이메일" name='email' size='small' fullWidth
                            placeholder='test@test.com' required value={form.email} onChange={handleChange} />
                        <TextField type='text' label="별명" name='nickname' size='small' fullWidth
                            placeholder='별명' required value={form.nickname} onChange={handleChange} />
                        <TextField type='password' label="비밀번호" name='password' size='small' fullWidth required value={form.password} onChange={handleChange} />
                        <TextField type='password' label="비밀번호 확인" name='rePassword' size='small' fullWidth required value={form.rePassword} onChange={handleChange} />

                        {
                            registerMutation.isError && (
                                <Typography variant='body2' color='error'>회원 가입에 실패했습니다!</Typography>
                            )
                        }
                        <Button type='submit' variant='contained' sx={{ mt: 1, py: 1.2, borderRadius: 2, textTransform: 'none', "&:hover": { backgroundColor: "#999" } }} disabled={registerMutation.isPending}>{registerMutation.isPending ? "회원가입 중..." : "회원가입"}</Button>
                    </Stack>
                </Box>
            </Paper>
        </Container>
    );
}

export default RegisterPage;