import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';

interface UserDetail {
  id: number;
  nickname: string;
  description: string | null;
}

interface CommentDetail {
  id: number;
  comment: string;
  created_at: string;
  deleted_at: string;
  isItNew: boolean;
  replyId: number;
  user: UserDetail;
}

export default function CommentHistory() {
  const [comments, setComments] = useState<CommentDetail[]>();
  const [checked, setChecked] = useState<string[]>([]);
  const [commentCount, setCommentCount] = useState<number>(0);

  const navigate = useNavigate();

  const dateParsing = (date: string): [string, boolean] => {
    const theDate = new Date(date);
    const todayDate = new Date();
    const oneDayPlus = new Date(date);
    oneDayPlus.setDate(oneDayPlus.getDate() + 1);

    const isItInOneDay = oneDayPlus >= todayDate;

    return [
      `${theDate.getFullYear()}.${String(theDate.getMonth() + 1).padStart(2, '0')}.${String(
        theDate.getDate(),
      ).padStart(2, '0')}. `,
      isItInOneDay,
    ];
  };

  useEffect(() => {
    fetch(`http://pien.kr:4000/user/1/replies`, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        let count = 0;
        const temp = [];

        for (let i = 0; i < data.length; i += 1) {
          if (!data[i].deleted_at) {
            count += 1;
            temp.push(data[i]);
          }
        }

        setCommentCount(count);
        setComments(
          temp.map((el: CommentDetail) => ({
            ...el,
            created_at: dateParsing(el.created_at)[0],
            isItNew: dateParsing(el.created_at)[1],
          })),
        );
      });
  }, []);

  const checkedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (checked.includes(event.target.id)) {
      const temp = checked.filter((el) => el !== event.target.id);
      setChecked(temp);
    } else {
      setChecked([...checked, event.target.id]);
    }
  };

  const checkAll = () => {
    if (checked.length !== comments?.length) {
      const temp: string[] = [];
      comments?.forEach((el) => {
        temp.push(String(el.id));
      });
      setChecked(temp);
    } else {
      setChecked([]);
    }
  };

  const deleteComment = (id: string[]) => {
    if (window.confirm('댓글을 삭제하시겠습니까?') === true) {
      fetch(`http://pien.kr:4000/user/1/replies/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJraXN1azYyM0BuYXZlci5jb20iLCJpYXQiOjE2NzM5Mzg4OTUsImV4cCI6MTY3Mzk0MDY5NX0.VWzQ1BIRwbrdAn1RLcmHol8lTtZf4Yx5we2pLpzQr3U',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === true) {
            fetch(`http://pien.kr:4000/user/1/replies`, {
              headers: {
                'Content-Type': 'application/json;charset=utf-8',
              },
            })
              .then((res) => res.json())
              .then((data) => {
                let count = 0;
                const temp = [];

                for (let i = 0; i < data.length; i += 1) {
                  if (!data[i].deleted_at) {
                    count += 1;
                    temp.push(data[i]);
                  }
                }

                setCommentCount(count);
                setComments(
                  temp.map((el: CommentDetail) => ({
                    ...el,
                    created_at: dateParsing(el.created_at)[0],
                    isItNew: dateParsing(el.created_at)[1],
                  })),
                );
              });
          }
        });
    }
    return null;
  };

  return (
    <OuterBox>
      <CommentCount>
        <div>{commentCount}</div>개의 작성한 댓글이 있습니다.
      </CommentCount>
      <List>
        {comments?.map((el) => (
          <CommentBox>
            <CommentInner>
              <CheckBox>
                <input
                  type='checkBox'
                  id={String(el.id)}
                  checked={checked.includes(String(el.id))}
                  onChange={(event) => checkedChange(event)}
                />
              </CheckBox>
              <Comment>
                <CommentDesc>
                  {el.comment}
                  {el.isItNew ? <IsItNew>N</IsItNew> : null}
                </CommentDesc>
                <CommentDate>{el.created_at}</CommentDate>
                <PostTitle>
                  안녕하십니까
                  <PostCommentCnt>[5]</PostCommentCnt>
                </PostTitle>
              </Comment>
            </CommentInner>
          </CommentBox>
        ))}
      </List>
      <ButtonBox>
        <SelectAll>
          <CheckAll onClick={checkAll}>
            <input type='checkBox' checked={checked.length === comments?.length} />
            <div>전체선택</div>
          </CheckAll>
        </SelectAll>
        <DeleteAndWrite>
          <DeleteBtn>삭제</DeleteBtn>
          <WriteBtn onClick={() => navigate('/community/posting')}>글쓰기</WriteBtn>
        </DeleteAndWrite>
      </ButtonBox>
    </OuterBox>
  );
}

const OuterBox = styled.div``;
const CommentCount = styled.div`
  display: flex;
  align-items: center;
  width: 860px;
  height: 45px;
  font-size: 13px;
  border-top: 1px solid black;
  border-bottom: 1px solid #e5e5e5;
  div {
    font-weight: bold;
  }
`;

const List = styled.div``;
const CommentBox = styled.div`
  width: 860px;
  border-bottom: 1px solid #e5e5e5;
`;
const CommentInner = styled.div`
  display: flex;
  width: 740px;
  padding: 15px 20px 15px 8px;
  font-size: 13px;
  border-bottom: 1px solid #e5e5e5;
`;

const CheckBox = styled.div`
  padding-right: 10px;
  input {
    width: 14px;
    height: 14px;
  }
`;
const Comment = styled.div`
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const CommentDesc = styled.div`
  display: flex;
`;

const IsItNew = styled.div`
  ${(props) => props.theme.variables.flex()};
  background-color: red;
  width: 12px;
  height: 12px;
  font-size: 10px;
  color: white;
  border-radius: 100%;
  margin-left: 5px;
`;

const CommentDate = styled.div`
  color: #878787;
  margin-top: 3px;
`;

const PostTitle = styled.div`
  display: flex;
  color: #878787;
  margin-top: 6px;
`;

const PostCommentCnt = styled.div`
  margin-left: 4px;
  font-weight: bold;
  color: ${(props) => props.theme.style.red};
`;

const ButtonBox = styled.div`
  display: flex;
  justify-content: space-between;
  height: 34px;
  margin: 10px 0px 34px 0px;
`;
const SelectAll = styled.div`
  ${(props) => props.theme.variables.flex()}
`;
const CheckAll = styled.div`
  ${(props) => props.theme.variables.flex()}
  display: flex;
  font-size: 13px;

  input {
    width: 14px;
    height: 14px;
    margin-left: 8px;
    margin-right: 12px;
  }

  &:hover {
    cursor: pointer;
  }
`;
const DeleteAndWrite = styled.div`
  display: flex;
`;
const DeleteBtn = styled.button`
  background-color: #eff0f2;
  border: none;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  padding: 0 14px;
  &:hover {
    cursor: pointer;
  }
`;
const WriteBtn = styled.button`
  border: none;
  background-color: #eff0f2;
  margin-left: 10px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: bold;
  padding: 0 14px;
  &:hover {
    cursor: pointer;
  }
`;
