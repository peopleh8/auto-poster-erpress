import { ChangeEvent, FormEvent, FC, useState, useEffect } from 'react'
import Title from './components/UI/Title/Title'
import Form from './components/UI/Form/Form'
import Field from './components/UI/Field/Field'
import Button from './components/UI/Button/Button'
import PosterButtons from './components/PosterButtons'
import PosterToolbar from './components/PosterToolbar'
import Modal from './components/UI/Modal/Modal'
import Loader from './components/UI/Loader/Loader'
import { ButtonType, FieldTypes, LoaderSizes, LoaderStyles } from './types/common.types'
import { useCopyToClipboard } from './hooks/use-copy'
import { FBAxios, commonAxios } from './config/axios'
import { openai } from './config/openai'
import { delay } from './utils/delay'
import copyIcon from './assets/icons/copy.svg'
import saveIcon from './assets/icons/save.svg'
import 'normalize.css'
import './styles/pages/App.scss'


const App: FC = () => {
  const [ isGlobalFetching, setGlobalFetching ] = useState<boolean>(true)
  const [ isSubjectSaving, setSubjectSaving ] = useState<boolean>(false)
  const [ isArticleFetching, setArticleFetching ] = useState<boolean>(false)
  const [ isArticlePostingToFB, setArticlePostingToFB ] = useState<boolean>(false)
  const [ isModalOpen, setModalOpen ] = useState<boolean>(false)
  const [ modalTitleText, setModalTitleText ] = useState<string>('')
  const [ subject, setSubject ] = useState<string>('Why it\'s important to have a good Realtor, Real estate news in florida, National real estate news (USA), Real estate news for the emerald coast, Real estate news for Panama City Beach, Real estate news for 30A Florida, Real estate news for Panama City')
  const [ article, setArticle ] = useState<string>('')
  const [ value, copy ] = useCopyToClipboard()

  const changeSubjectHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value)
  }

  const changeArticleHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setArticle(e.target.value)
  }

  const rewriteArticleHandler = (article: string) => {
    setArticle(article)
  }

  const fetchingArticle = (payload: boolean) => {
    setArticleFetching(payload)
  }

  const postingArticleToFB = (payload: boolean) => {
    setArticlePostingToFB(payload)
  }

  const toggleModalOpen = (payload: boolean) => {
    setModalOpen(payload)
  }

  const setModalTextHander = (title: string) => {
    setModalTitleText(title)
  }

  const copyHandler = () => {
    copy(article)
    setModalTitleText('The text has been copied!')
    toggleModalOpen(true)
  }

  const postToFB = async () => {
    try {
      postingArticleToFB(true)
      await FBAxios.post(`/photos?message=${encodeURIComponent(article)}&url=https://img.freepik.com/free-photo/a-cupcake-with-a-strawberry-on-top-and-a-strawberry-on-the-top_1340-35087.jpg`)

      setModalTitleText('Article has been posted!')
      toggleModalOpen(true)
    } catch (e: unknown) {
      console.error((e as Error).message)

      setModalTitleText('Something went wrong, please try again!')
      toggleModalOpen(true)
    } finally {
      postingArticleToFB(false)
    }
  }

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      fetchingArticle(true)
      
      const chatCompletion = await openai.chat.completions.create({ 
        messages: [{ role: 'user', content: `${subject} - Generate an article on one of these topics with emojis and with a link to photo on the Internet in jpg format, it should correspond to the content of the article. The link to the photo should be at the end and should not be 404` }], 
        model: 'gpt-4-1106-preview',
        temperature: 0.9,
      })
  
      if (chatCompletion?.choices[0]?.message?.content) {
        rewriteArticleHandler(chatCompletion.choices[0].message.content)
      }
    } catch (e: unknown) {
      console.error((e as Error).message)

      setModalTextHander('Something went wrong, please try again!')
      toggleModalOpen(true)
    } finally {
      fetchingArticle(false)
    }
  }

  const saveSubjectHandler = async () => {
    console.log('save')
    try {
      setSubjectSaving(true)
      setModalTitleText('Subject has been saved!')
      setModalOpen(true)
      
      const res = await commonAxios.post('/setChatCompletionSubject', { subject })

      console.log(res)
    } catch (e: unknown) {
      console.log((e as Error).message)

      setModalTitleText('Something went wrong, please try again!')
      setModalOpen(true)
    } finally {
      setSubjectSaving(false)
    }
  }

  useEffect(() => {
    const getArticle = async () => {
      try {
        setGlobalFetching(true)
        
        const { data } = await commonAxios.get('/getChatCompletionResult')

        setArticle(data.article || '')
        setSubject(data.subject || '')
      } catch (e: unknown) {
        console.error((e as Error).message)
      } finally {
        delay(200).then(() => setGlobalFetching(false))
      }
    }

    getArticle()
  }, [])
  
  return (
    <div className='poster'>
      { isGlobalFetching ? (
        <Loader 
          size={LoaderSizes.Large} 
          theme={LoaderStyles.Dark}
          isLoading
        />
      ) : (
        <>
          <Title leavel={1} classes='poster__title'>Auto Poster</Title>
          <Form 
            classes='poster__form poster-form'
            submitHandler={submitHandler}
          >
            <PosterToolbar>
              <Field 
                classes='poster-form__field'
                fieldType={FieldTypes.Input}
                name='subject' 
                type='text' 
                placeholder='Subject'
                value={subject}
                onChange={changeSubjectHandler}
              />
              <Button 
                classes='poster-form__btn'
                text='Save'
                icon={saveIcon}
                isFetching={isSubjectSaving}
                type={ButtonType.Button}
                disabled={subject.length < 5}
                onClick={saveSubjectHandler}
              />
            </PosterToolbar>
            <PosterButtons>
              <Button 
                classes='poster-form__btn'
                text='Generate Article'
                isFetching={isArticleFetching}
                type={ButtonType.Submit}
                disabled={subject.length < 5}
              />
              <Button 
                classes='poster-form__btn'
                text='Post to Facebook'
                isFetching={isArticlePostingToFB}
                type={ButtonType.Button}
                disabled={article.length < 5}
                onClick={postToFB}
              />
              {/* <Button 
                classes='poster-form__btn'
                text='Post to Linked In'
                type={ButtonType.Button}
                disabled
              /> */}
              <Button 
                classes='poster-form__btn'
                text='Copy'
                icon={copyIcon}
                type={ButtonType.Button}
                disabled={article.length < 10}
                onClick={copyHandler}
              />
            </PosterButtons>
            <Field
              classes='poster-form__field'
              fieldType={FieldTypes.Textarea}
              copyValue={value}
              name='article' 
              placeholder='Article'
              value={article}
              onChange={changeArticleHandler}
            />
          </Form>
          <Modal
            isOpen={isModalOpen}
            setOpen={toggleModalOpen}
          >
            <Title leavel={1} classes='modal__title'>{modalTitleText}</Title>
            <Button 
              classes='modal__btn'
              text='Close'
              type={ButtonType.Button}
              onClick={() => toggleModalOpen(false)}
            />
          </Modal>
        </>
      ) }
    </div>
  )
}

export default App