import Axios from "../../API/AxiosApi"

const GITHUB_API_URL = 'https://api.github.com'; //https://github.com/leesujeong0305/clientdemo.git

export const AxiosCommits = async (owner, repo) => {
  try {
    const response = await Axios.get(`${GITHUB_API_URL}/repos/${owner}/${repo}/commits`);
    return response.data;
  } catch (error) {
    console.error('Error fetching commits:', error);
    return [];
  }
}

export default AxiosCommits
