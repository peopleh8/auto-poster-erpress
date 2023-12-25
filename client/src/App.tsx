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
import PosterUpload from './components/PosterUpload'
import PosterPhoto from './components/PosterPhoto'
import DropboxChooser from './components/DropboxChooser'
import PosterUploadBtns from './components/PosterUploadBtns'
import 'normalize.css'
import './styles/pages/App.scss'
import PosterLinks from './components/PosterLinks'
import Link from './components/UI/Link/Link'

const App: FC = () => {
  const [ isGlobalFetching, setGlobalFetching ] = useState<boolean>(true)
  const [ isSubjectSaving, setSubjectSaving ] = useState<boolean>(false)
  const [ isArticleFetching, setArticleFetching ] = useState<boolean>(false)

  const [ isPhotoGenerating, setPhotoGenerating ] = useState<boolean>(false)

  const [ isArticlePostingToFB, setArticlePostingToFB ] = useState<boolean>(false)
  const [ isModalOpen, setModalOpen ] = useState<boolean>(false)
  const [ modalTitleText, setModalTitleText ] = useState<string>('')
  const [ subject, setSubject ] = useState<string>('Make a catchy Facebook post about Real Estate News in Florida. The post needs to use emoji’s, use real article data. The post needs to be structured as this: Brief description of Florida Real Estate update, Why this information is import for the consumer, and a takeaway. Lastly, to comply with Florida real estate advertising laws I need to display my name, number, and brokerage at the bottom of my post as follows: Dylan Smith | Realtor | 865-604-6654 | Realty ONE Group Emerald Coast')
  const [ imageSubject, setImageSubject ] = useState<string>('Real estate Florida')
  const [ article, setArticle ] = useState<string>('')
  const [ exampleArticle, setExampleArticle ] = useState<string>('The pace fell significantly short of expectations on Wall Street. Economists had forecast new-home sales to total 688,000 in November. New-home sales are at the lowest level since November 2022. The rate of new-home sales was dragged down by sharp drops in the South and the West. The data from October was revised. New-home sales fell a revised 4% in October, compared with the initial estimate of a 5.6% drop. The new-home sales data are volatile month over month and are often revised. Key details: The median sales price of a new home sold in November rose to $434,700 from $414,900 in the prior the month. The supply of new homes for sale rose 16.5% between October and November, equating to a 9.2-month supply. Half of the nation reported an increase in new-home sales, with the Midwest posting the biggest gains at 25%, followed by the Northeast at 3.1%. Sales fell in the South by 20.9% and in the West by 5.1%. Overall, sales of new homes are up 1.4% compared with last year. Big picture: Housing data can be noisy, so this month’s fall in new-home sales may be an aberration. That won’t be known until a trend develops. Aside from the bleak number, the U.S. housing market is overall showing early signs of a recovery as mortgage rates fall significantly in December and home-buying demand ticks up. And rates are poised to fall further, based on economists’ estimates. With a lack of resale inventory persisting, home builders are in a strong position to meet increasing buyer demand—and they’re responding. Housing starts jumped 15% in November, a sign that builders are ramping up construction on new housing units. What are they saying? “The significant decline in new-home sales in the largest region of the country, the South, drove this month’s new-home sales report into negative territory,” analysts at Raymond James wrote in a note. “This was the largest month-over-month decline since April of 2022.” Market reaction: Stocks were up in early trading on Friday. The yield on the 10-year Treasury note was below 3.9%. Shares of builders, including D.R. Horton Inc., Lennar Corp., PulteGroup Inc. and Toll Brothers Inc. were up in the morning trading session. MarketWatch, the place where you can find the latest stock market, financial and business news. Cryptocurrency is trending now, get the latest info on Bitcoin, Ethereum, and XRP.')
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

  const changeExampleArticleHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setExampleArticle(e.target.value)
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

      const articleForSend = exampleArticle.trim() !== ''
        ? `${subject} - Generate an article on one of these topics with emojis. Here is an example article: ${exampleArticle}`
        : `${subject} - Generate an article on one of these topics with emojis.`
      
      const chatCompletion = await openai.chat.completions.create({ 
        messages: [{ role: 'user', content: articleForSend }], 
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
      
      await commonAxios.post('/setChatCompletionSubject', { subject, imageSubject, exampleArticle })

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
        setExampleArticle(data.exArticle || '')
      } catch (e: unknown) {
        console.error((e as Error).message)
      } finally {
        delay(200).then(() => setGlobalFetching(false))
      }
    }

    getArticle()
  }, [])

  const dropDownSuccess = (files: any) => {
    const { link } = files[0]
    setPhoto(link)
  }
  
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
                disabled={article.length < 5 || isSubjectSaving || isArticleFetching || isArticlePostingToFB || isPhotoGenerating}
                onClick={copyHandler}
              />
            </PosterButtons>
            <PosterUpload>
              <PosterPhoto photo={photo} />
              <PosterUploadBtns>
                <PosterLinks>
                  <Link 
                    text='realtor.com'
                    href='https://www.realtor.com/realestateandhomes-search/Florida'
                  />
                  <Link 
                    text='cpar.us'
                    href='https://www.cpar.us'
                  />
                  <Link 
                    text='floridarealtors.org'
                    href='https://www.floridarealtors.org'
                  />
                </PosterLinks>
                <Button 
                  classes='poster-form__btn'
                  text={!photo ? 'Generate Random Image' : 'Regenerate Image'}
                  isFetching={isPhotoGenerating}
                  type={ButtonType.Button}
                  disabled={isSubjectSaving || isArticleFetching || isArticlePostingToFB}
                  onClick={generatePhoto}
                />
                <DropboxChooser 
                  onSuccess={dropDownSuccess}
                  disabled={isSubjectSaving || isArticleFetching || isArticlePostingToFB || isPhotoGenerating}
                />
              </PosterUploadBtns>
              <Field
                classes='poster-form__field'
                fieldType={FieldTypes.Textarea}
                name='article-example' 
                placeholder='Example Article'
                value={exampleArticle}
                onChange={changeExampleArticleHandler}
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