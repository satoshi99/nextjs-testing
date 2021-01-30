import Layout from '../components/Layout';
import { GetStaticProps } from 'next'
import { getAllTaskData } from '../lib/fetch'
import useSWR from 'swr'
import axios from 'axios'
import { TASK } from '../Types/Types'

interface STATICPROPS {
    staticTasks: TASK[]
}

const axiosFetcher = async () => {
    const result = await axios.get<TASK[]>(
        'https://jsonplaceholder.typicode.com/todos/?_limit=10'
    )
    return result.data 
}

const TaskPage: React.FC<STATICPROPS> = ({ staticTasks }) => {
    const { data: tasks, error } = useSWR('todosFetch', axiosFetcher, {
        initialData: staticTasks,
        revalidateOnMount: true,
    })
    if (error) return <span>Error!</span>
    return (
        <Layout title='Todos'>
            <p className="text-4xl mb-10">todos page</p>
            <ul>
                {tasks &&
                tasks.map(task => (
                <li key={task.id}>
                    {task.id}
                    {' : '}
                    <span>{task.title}</span>
                </li> 
                ))}
            </ul>
        </Layout>
    )
}
export default TaskPage;

export const getStaticProps: GetStaticProps = async () => {
    const staticTasks = await getAllTaskData();
    return {
        props: { staticTasks }
    }
}
