const getData = async () => {
  try {
    const response = await fetch(`https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json`, { mode: 'cors' });

    const data = await response.json();

    return data;
  } catch (error) {
    alert(error);
  }
  return false;
};


const drawMap = async (info) => {
  const data = await info;

  
}

drawMap(getData());
