import React, { useState, useEffect } from 'react';
import { GoHome } from 'react-icons/go';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom'; 
import axios from 'axios';

const RecipePage = () => {
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(''); 
  const [isLoading, setIsLoading] = useState(true);
  const [imgFlag, setImgFlag] = useState(false);
  const navigate = useNavigate();
  const { recommendId } = useParams(); 


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://172.30.1.89:8080/recipe/recommend/${recommendId}`);
        if (response.data) {
          setTitle(response.data.foodName);
          setIngredients(response.data.ingredients);
          setSteps(response.data.recipe);
        }
      } catch (error) {
        console.error('에러내용:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [recommendId]);
  


  //결과화면에서 저장하기 -> 저장리스트로 이동 
  const handleSaveButtonClick = async () => {
    try {
      await axios.post('http://172.30.1.89:8080/recipe/save', {
        recipeDto: {
          foodName: title,
          ingredients: ingredients,
          recipe: steps,
        },
      });
      console.log('저장 성공');
      navigate('/gptSavedList');
    } catch (error) {
      console.error('에러내용:', error);
    }
  };

  if (isLoading) {
    return (
      <section className="flex flex-col items-center justify-center h-screen ">
        <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-gray-900 mb-8"></div>
        <h1 className="text-2xl font-bold text-gray-900  mb-4">로딩 중 </h1>
        <button
          onClick={() => navigate('/main')}
          className="text-sm text-gray-400"
        >
          취소
        </button>
      </section>
    );
  }

  return (
    <section className="bg-white min-h-screen p-6">
      <div
        className="absolute top-5 left-30 ml-0 border-2 w-10 h-10 transition ease-in-out delay-150 bg-main hover:bg-indigo-500 hover:scale-125 hover:cursor-pointer hover:text-white rounded-full flex items-center justify-center"
        onClick={() => navigate("/board")}
      >
        <FaArrowLeft />
      </div>
      <main className="max-w-md mx-auto bg-white rounded-lg overflow-hidden md:max-w-lg">
        <div className="md:flex">
          <div className="w-full p-4 pt-8">
            <div className="border-b-2 border-gray-100 py-2">
              <h1 className="font-score text-2xl font-bold text-gray-800 text-center">
                {title}
              </h1>
            </div>
            <div className="recipebox p-4 bg-gray-100 rounded-lg overflow-y-auto max-h-96">
              <h2 className="font-score text-lg font-bold text-gray-800">
                재료
              </h2>
              <ul className="py-2 flex flex-wrap">
                {ingredients.map((ingredient, index) => (
                  <li
                    key={index}
                    className="font-score text-gray-600 mr-4 mb-2"
                  >
                    {ingredient}
                  </li>
                ))}
              </ul>
              <h2 className="font-score text-lg font-bold text-gray-800 mt-4">
                만드는 방법
              </h2>
              <ol className="list-decimal list-inside">
                {steps.map((step, index) => (
                  <li key={index} className="font-score text-gray-600">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-5 left-0 right-0 px-6">
        <div
          className="mx-auto flex justify-between"
          style={{ maxWidth: "400px" }}
        >
          <button
            className="font-score bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-8 rounded-full"
            onClick={() => navigate("/recipe/recommend")}
          >
            다시 할래요
          </button>
          <button
            className="font-score bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-8 rounded-full"
            onClick={handleSaveButtonClick}
          >
            저장할래요
          </button>
        </div>
      </footer>
    </section>
  );
};

export default RecipePage;
