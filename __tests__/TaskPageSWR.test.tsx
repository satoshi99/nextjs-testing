import '@testing-library/jest-dom/extend-expect';
import { render, screen, cleanup } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import TaskPage from '../pages/task-page';
import { TASK } from '../Types/Types';

const server = setupServer(
    rest.get(
        'https://jsonplaceholder.typicode.com/todos/?_limit=10',
        (req, res, ctx) => {
            return res(
                ctx.status(200),
                ctx.json([
                    {
                        userId: 1,
                        id: 1,
                        title: 'Task A',
                        completed: false
                    },
                    {
                        userId: 1,
                        id: 2,
                        title: 'Task B',
                        completed: true
                    }
                ])
            )
        }
    )
)

beforeAll(() => {
    server.listen()
})
beforeEach(() => {
    server.resetHandlers()
    cleanup()
})
afterAll(() => {
    server.close()
})

describe('Todos test / useSWR', () => {
    let staticProps: TASK[];
    staticProps = [
        {
            userId: 3,
            id: 3,
            title: 'Task C',
            completed: true
        },
        {
            userId: 4,
            id: 4,
            title: 'Task D',
            completed: false
        }
    ]
    it('Should render CSF data after pre-rendered data', async () => {
        render(
            <SWRConfig value={{ dedupingInterval: 0}}>
                <TaskPage staticTasks={staticProps} />
            </SWRConfig>
        )
        expect(await screen.findByText('Task C')).toBeInTheDocument()
        expect(screen.getByText('Task D')).toBeInTheDocument()
        expect(await screen.findByText('Task A')).toBeInTheDocument()
        expect(screen.getByText('Task B')).toBeInTheDocument()
    })
    it('should render Error text when fetch failed', async() => {
        server.use(
            rest.get(
                'https://jsonplaceholder.typicode.com/todos/?_limit=10',
                (req, res, ctx) => {
                    return res(ctx.status(400))
                }
            )
        )
        render(
            <SWRConfig value={{ dedupingInterval: 0}}>
                <TaskPage staticTasks={staticProps} />
            </SWRConfig>
        )
        expect(await screen.findByText('Error!')).toBeInTheDocument()
    })
})

