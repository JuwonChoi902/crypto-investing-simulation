import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import DescriptionBox from './DescriptionBox';
import CommentsBox from './CommentsBox';
import NavigateBoxTop from './NavigateBoxTop';
import NavigateBoxUnder from './NavigateBoxUnder';
import { PostDataType } from '../../../../typing/types';

type PostProps = {
  setPostNow: React.Dispatch<React.SetStateAction<number | null>>;
  setBoardNow: React.Dispatch<React.SetStateAction<number | null>>;
  setMenuNow: React.Dispatch<React.SetStateAction<number>>;
  setProfileId: React.Dispatch<React.SetStateAction<number | null | undefined>>;
};

export default function Post({ setPostNow, setBoardNow, setMenuNow, setProfileId }: PostProps) {
  const [postData, setPostData] = useState<PostDataType>();
  const [replying, setReplying] = useState<number | null>(null);
  const [commentCount, setCommentCount] = useState<number>(0);
  const commentWindowRef = useRef<HTMLDivElement>(null);

  return (
    <OuterBox>
      <NavigateBoxTop setPostNow={setPostNow} postData={postData} />
      <MainBox>
        <DescriptionBox
          commentCount={commentCount}
          setPostNow={setPostNow}
          commentWindowRef={commentWindowRef}
          setBoardNow={setBoardNow}
          setReplying={setReplying}
          postData={postData}
          setPostData={setPostData}
          setMenuNow={setMenuNow}
          setProfileId={setProfileId}
        />
        <CommentsBox
          commentWindowRef={commentWindowRef}
          replying={replying}
          setReplying={setReplying}
          commentCount={commentCount}
          setCommentCount={setCommentCount}
          setProfileId={setProfileId}
          setMenuNow={setMenuNow}
        />
      </MainBox>
      <NavigateBoxUnder setPostNow={setPostNow} />
    </OuterBox>
  );
}

const OuterBox = styled.div`
  width: 860px;
`;

const MainBox = styled.div`
  border: 1px solid #e5e5e5;
  padding: 29px;
  border-radius: 5px;
  position: relative;
`;
