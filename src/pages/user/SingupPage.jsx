import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignupPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: 이메일 인증, 2: 회원가입 폼

    const [formData, setFormData] = useState({
        username: '',  // 이메일 형식
        password: '',
        passwordConfirm: '',
        phone: '',
        verificationCode: ''
    });

    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [timer, setTimer] = useState(300); // 5분 = 300초
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    // 비밀번호 유효성 검증 상태
    const [passwordValidation, setPasswordValidation] = useState({
        hasMinLength: false,
        hasTwoTypes: false
    });

    // 타이머 처리
    useEffect(() => {
        if (isCodeSent && timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else if (timer === 0) {
            setError('인증시간이 만료되었습니다. 인증번호를 재발송해주세요.');
        }
    }, [isCodeSent, timer]);

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // 비밀번호 실시간 유효성 검증
        if (name === 'password') {
            validatePassword(value);
        }
    };

    // 비밀번호 유효성 검증
    const validatePassword = (password) => {
        const hasMinLength = password.length >= 8 && password.length <= 32 && !password.includes(' ');

        let typeCount = 0;
        if (/[a-zA-Z]/.test(password)) typeCount++;
        if (/[0-9]/.test(password)) typeCount++;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) typeCount++;

        setPasswordValidation({
            hasMinLength,
            hasTwoTypes: typeCount >= 2
        });
    };

    // 인증번호 발송
    const handleSendCode = async () => {
        if (!formData.username) {
            setError('이메일을 입력해주세요.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await axios.post('http://localhost:8080/api/auth/send-verification', {
                username: formData.username
            });

            setIsCodeSent(true);
            setTimer(300);
            setSuccess('인증번호가 발송되었습니다. 이메일을 확인해주세요.');

        } catch (err) {
            setError(err.response?.data?.message || '인증번호 발송에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 인증번호 재발송
    const handleResendCode = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await axios.post('http://localhost:8080/api/auth/resend-verification', {
                username: formData.username
            });

            setTimer(300);
            setSuccess('인증번호가 재발송되었습니다.');

        } catch (err) {
            setError(err.response?.data?.message || '인증번호 재발송에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 인증번호 확인
    const handleVerifyCode = async () => {
        if (!formData.verificationCode) {
            setError('인증번호를 입력해주세요.');
            return;
        }

        if (formData.verificationCode.length !== 6) {
            setError('인증번호는 6자리입니다.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await axios.post('http://localhost:8080/api/auth/verify-code', {
                username: formData.username,
                verificationCode: formData.verificationCode
            });

            setIsEmailVerified(true);
            setStep(2);
            setSuccess('이메일 인증이 완료되었습니다!');

        } catch (err) {
            setError(err.response?.data?.message || '인증번호가 올바르지 않습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 회원가입
    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // 유효성 검증
        if (!isEmailVerified) {
            setError('이메일 인증을 완료해주세요.');
            return;
        }

        if (!passwordValidation.hasMinLength || !passwordValidation.hasTwoTypes) {
            setError('비밀번호 조건을 확인해주세요.');
            return;
        }

        if (formData.password !== formData.passwordConfirm) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        setLoading(true);

        try {
            await axios.post('http://localhost:8080/api/auth/singup', formData);

            setSuccess('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');

            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.message || '회원가입에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 타이머 포맷 (5:00)
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                <main className="grow">
                    <div className="px-4 sm:px-6 lg:px-8 py-12 w-full max-w-[400px] mx-auto">

                        {/* 상단 로고 및 제목 */}
                        <div className="text-center mb-10">
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">회원가입</h1>
                            <p className="text-sm text-gray-500">나의 온라인 사수, 스터딧</p>
                        </div>

                        {/* 성공 메시지 */}
                        {success && (
                            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
                                {success}
                            </div>
                        )}

                        {/* 에러 메시지 */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        {/* Step 1: 이메일 인증 */}
                        {step === 1 && (
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                        이메일
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="email"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            disabled={isCodeSent}
                                            placeholder="example@studit.com"
                                            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:bg-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleSendCode}
                                            disabled={isCodeSent || loading}
                                            className="px-4 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                        >
                                            {isCodeSent ? '발송완료' : '인증번호'}
                                        </button>
                                    </div>
                                </div>

                                {isCodeSent && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                            인증번호
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                name="verificationCode"
                                                value={formData.verificationCode}
                                                onChange={handleChange}
                                                placeholder="6자리 인증번호"
                                                maxLength={6}
                                                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:bg-gray-800"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleVerifyCode}
                                                disabled={loading || timer === 0}
                                                className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                확인
                                            </button>
                                        </div>

                                        <div className="mt-2 flex items-center justify-between text-sm">
                                            <p className={`${timer <= 60 ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                                                남은 시간: {formatTime(timer)}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={handleResendCode}
                                                disabled={loading}
                                                className="text-violet-600 hover:text-violet-700 font-medium disabled:opacity-50"
                                            >
                                                재발송
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 2: 회원가입 폼 */}
                        {step === 2 && (
                            <form className="space-y-5" onSubmit={handleSignup}>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                        이메일
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={formData.username}
                                            disabled
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-700 pr-24"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 font-semibold text-sm">
                                            ✓ 인증완료
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                        비밀번호
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={passwordVisible ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="********"
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:bg-gray-800"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setPasswordVisible(!passwordVisible)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                                            </svg>
                                        </button>
                                    </div>
                                    <ul className="mt-2 space-y-1 text-[11px]">
                                        <li className={`flex items-center ${passwordValidation.hasTwoTypes ? 'text-green-600' : 'text-gray-500'}`}>
                                            {passwordValidation.hasTwoTypes ? '✓' : '○'} 영문/숫자/특수문자 중, 2가지 이상 포함
                                        </li>
                                        <li className={`flex items-center ${passwordValidation.hasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
                                            {passwordValidation.hasMinLength ? '✓' : '○'} 8자 이상 32자 이하 입력 (공백 제외)
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                        비밀번호 확인
                                    </label>
                                    <input
                                        type="password"
                                        name="passwordConfirm"
                                        value={formData.passwordConfirm}
                                        onChange={handleChange}
                                        placeholder="********"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:bg-gray-800"
                                        required
                                    />
                                    {formData.passwordConfirm && formData.password !== formData.passwordConfirm && (
                                        <p className="mt-1 text-xs text-red-600">비밀번호가 일치하지 않습니다.</p>
                                    )}
                                    {formData.passwordConfirm && formData.password === formData.passwordConfirm && (
                                        <p className="mt-1 text-xs text-green-600">✓ 비밀번호가 일치합니다.</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-md transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? '가입 중...' : '가입하기'}
                                </button>
                            </form>
                        )}

                        {/* 간편 회원가입 구분선 */}
                        <div className="mt-8 mb-6">
                            <div className="relative flex items-center justify-center">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                                </div>
                                <div className="relative bg-white dark:bg-gray-900 px-3 text-xs text-gray-400">간편 회원가입</div>
                            </div>
                        </div>

                        {/* 소셜 버튼 4종 */}
                        <div className="flex items-center justify-center gap-4">
                            <button className="w-12 h-12 flex items-center justify-center bg-gray-50 border border-gray-100 rounded-xl shadow-sm hover:bg-white transition-all">
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
                            </button>
                            <button className="w-12 h-12 flex items-center justify-center bg-[#03C75A] rounded-xl shadow-sm hover:opacity-90">
                                <span className="text-white text-lg font-black">N</span>
                            </button>
                            <button className="w-12 h-12 flex items-center justify-center bg-[#FEE500] rounded-xl shadow-sm hover:bg-[#FADA00]">
                                <svg className="w-6 h-6 fill-[#3C3E44]" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.558 1.707 4.8 4.34 6.011l-1.09 4.011c-.05.195.176.35.334.238l4.766-3.328c.214.02.433.033.65.033 4.97 0 9-3.185 9-7.115S16.97 3 12 3z"/></svg>
                            </button>
                            <button className="w-12 h-12 flex items-center justify-center bg-[#24292F] rounded-xl shadow-sm hover:opacity-90">
                                <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                            </button>
                        </div>

                        {/* 로그인 링크 */}
                        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                            이미 계정이 있으신가요?
                            <button
                                onClick={() => navigate('/')}
                                className="ml-1 text-violet-600 hover:text-violet-700 font-semibold"
                            >
                                로그인
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default SignupPage;