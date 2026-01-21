import React, { useState, useEffect } from 'react';
import axios from "axios";

function ConnectTest() {
    const [data, setData] = useState([]);
    const [status, setStatus] = useState('연결 시도 중...');

    useEffect(() => {
        // Vite 프록시 설정(/api)을 용한 호출
        axios.get('/api/studies/test')
            .then(response => {
                console.log('수신 데이터:', response.data);
                setData(response.data);
                setStatus('✅ 연결 성공!');
            })
            .catch(error => {
                console.error('에러 발생:', error);
                setStatus('❌ 연결 실패 (콘솔창을 확인하세요)');
            });
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>🔗 Backend Connection Test</h2>
            <p>상태: <strong>{status}</strong></p>

            <hr />

            <h3>수신된 데이터 목록:</h3>
            {data.length > 0 ? (
                <ul style={{ background: '#f0f0f0', padding: '20px', borderRadius: '8px' }}>
                    {data.map((item, index) => (
                        <li key={index} style={{ marginBottom: '10px' }}>
                            <strong>스터디명:</strong> {item.study_nm} <br />
                            <strong>카테고리:</strong> {item.category} <br />
                            <strong>최대인원:</strong> {item.max_mbr_nocs}명
                        </li>
                    ))}
                </ul>
            ) : (
                <p>데이터가 없습니다.</p>
            )}

            <button onClick={() => window.location.reload()} style={{ marginTop: '20px', padding: '10px' }}>
                다시 시도
            </button>
        </div>
    );
}

export default ConnectTest;