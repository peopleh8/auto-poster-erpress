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
import { FBAxios, commonAxios, unsplashAxios } from './config/axios'
import { openai } from './config/openai'
import { delay } from './utils/delay'
import copyIcon from './assets/icons/copy.svg'
import saveIcon from './assets/icons/save.svg'
import 'normalize.css'
import './styles/pages/App.scss'
import PosterUpload from './components/PosterUpload'
import PosterPhoto from './components/PosterPhoto'


const App: FC = () => {
  const [ isGlobalFetching, setGlobalFetching ] = useState<boolean>(true)
  const [ isSubjectSaving, setSubjectSaving ] = useState<boolean>(false)
  const [ isArticleFetching, setArticleFetching ] = useState<boolean>(false)

  const [ isPhotoGenerating, setPhotoGenerating ] = useState<boolean>(false)

  const [ isArticlePostingToFB, setArticlePostingToFB ] = useState<boolean>(false)
  const [ isModalOpen, setModalOpen ] = useState<boolean>(false)
  const [ modalTitleText, setModalTitleText ] = useState<string>('')
  const [ subject, setSubject ] = useState<string>('Why it\'s important to have a good Realtor, Real estate news in florida, National real estate news (USA), Real estate news for the emerald coast, Real estate news for Panama City Beach, Real estate news for 30A Florida, Real estate news for Panama City')
  const [ imageSubject, setImageSubject ] = useState<string>('Real estate')
  const [ article, setArticle ] = useState<string>('')
  const [ photo, setPhoto ] = useState<string>('')
  const [ value, copy ] = useCopyToClipboard()

  const changeSubjectHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value)
  }

  const changeImageSubjectHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setImageSubject(e.target.value)
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
      await FBAxios.post(`/photos?message=${encodeURIComponent(article)}&url=${photo}`)

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

  const generatePhoto = async () => {
    try {
      setPhotoGenerating(true)
      
      const { data } = await unsplashAxios.get(`/photos/random/?query=${imageSubject}`)

      setPhoto(data.urls.full)
      setModalTitleText('Image has been generated!')
      setModalOpen(true)
    } catch (e: unknown) {
      console.error((e as Error).message)

      setModalTitleText('Something went wrong, please try again!')
      setModalOpen(true)
    } finally {
      setPhotoGenerating(false)
    }
  }

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      fetchingArticle(true)
      
      const chatCompletion = await openai.chat.completions.create({ 
        messages: [{ role: 'user', content: `${subject} - Generate an article on one of these topics with emojis.` }], 
        model: 'gpt-4-1106-preview',
        temperature: 0.1,
      })

      const { data } = await unsplashAxios.get(`/photos/random/?query=${imageSubject}`)
  
      if (chatCompletion?.choices[0]?.message?.content) {
        rewriteArticleHandler(chatCompletion.choices[0].message.content)
        setPhoto(data.urls.full)
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
    try {
      setSubjectSaving(true)
      
      await commonAxios.post('/setChatCompletionSubject', { subject, imageSubject })

      setModalTitleText('Subject has been saved!')
      setModalOpen(true)
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
        setPhoto(data.photo || '')
        setSubject(data.subject || '')
        setImageSubject(data.imageSubject)
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
                name='image-subject' 
                type='text' 
                placeholder='Image Subject'
                value={imageSubject}
                onChange={changeImageSubjectHandler}
              />
              <Field 
                classes='poster-form__field'
                fieldType={FieldTypes.Input}
                name='article-subject' 
                type='text' 
                placeholder='Article Subject'
                value={subject}
                onChange={changeSubjectHandler}
              />
              <Button 
                classes='poster-form__btn'
                text='Save'
                icon={saveIcon}
                isFetching={isSubjectSaving}
                type={ButtonType.Button}
                disabled={subject.length < 5 || imageSubject.length < 5 || isArticleFetching || isArticlePostingToFB || isPhotoGenerating}
                onClick={saveSubjectHandler}
              />
            </PosterToolbar>
            <PosterButtons>
              <Button 
                classes='poster-form__btn'
                text='Generate Article'
                isFetching={isArticleFetching}
                type={ButtonType.Submit}
                disabled={subject.length < 5 || isSubjectSaving || isArticlePostingToFB || isPhotoGenerating}
              />
              <Button 
                classes='poster-form__btn'
                text='Post to Facebook'
                isFetching={isArticlePostingToFB}
                type={ButtonType.Button}
                disabled={article.length < 5 || !photo || isSubjectSaving || isArticleFetching || isPhotoGenerating}
                onClick={postToFB}
              />
              <Button 
                classes='poster-form__btn'
                text='Copy'
                icon={copyIcon}
                type={ButtonType.Button}
                disabled={article.length < 10 || isSubjectSaving || isArticleFetching || isArticlePostingToFB || isPhotoGenerating}
                onClick={copyHandler}
              />
            </PosterButtons>
            <PosterUpload>
              <PosterPhoto photo={photo} />
              <Button 
                classes='poster-form__btn'
                text={!photo ? 'Generate Image' : 'Regenerate Image'}
                isFetching={isPhotoGenerating}
                type={ButtonType.Button}
                disabled={isSubjectSaving || isArticleFetching || isArticlePostingToFB}
                onClick={generatePhoto}
              />
            </PosterUpload>
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