import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import PostBox2 from './components/postComponents/PostBox';
import RankingBox from './components/otherComponents/RankingBox';
import UserInfo from './components/userInfoComponents/UserInfo';
import BoardsBox from './components/otherComponents/BoardsBox';
import MenuBox from './components/otherComponents/MenuBox';

export default function Community() {
  const [postNow, setPostNow] = useState<number | null>(null);
  const [menuNow, setMenuNow] = useState<number>(2);
  const [boardNow, setBoardNow] = useState<number | null>(0);

  const params = useParams();

  useEffect(() => {
    if (params.id === 'list') {
      setPostNow(null);
    } else {
      setPostNow(Number(params.id));
    }
  }, [params.id]);

  return (
    <OuterBox>
      <MenuBox menuNow={menuNow} setMenuNow={setMenuNow} setBoardNow={setBoardNow} />
      <MainBox>
        <RankAndBoards>
          <RankingBox />
          <BoardsBox setPostNow={setPostNow} setBoardNow={setBoardNow} boardNow={boardNow} />
        </RankAndBoards>
        <Contents>
          {menuNow === 2 ? (
            <PostBox2
              setPostNow={setPostNow}
              setBoardNow={setBoardNow}
              boardNow={boardNow}
              postNow={postNow}
            />
          ) : null}
          {menuNow === 3 ? <UserInfo /> : null}
        </Contents>
      </MainBox>
    </OuterBox>
  );
}

const OuterBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  margin-top: 100px;
`;
const MainBox = styled.div`
  display: flex;
  justify-content: space-between;
  width: 1080px;
  margin-top: 16px;
`;

const RankAndBoards = styled.div``;
const Contents = styled.div``;
