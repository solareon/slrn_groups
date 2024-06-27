import { create } from 'zustand';

type PlayerListStoreState = {
  members: string[];
  leader: number;
  addMember: (member: string) => void;
  setLeader: (leader: number) => void;
};

const usePlayerListStore = create<PlayerListStoreState>((set) => ({
  members: [],
  leader: 0,
  addMember: (member) => set((state) => ({ members: [...state.members, member] })),
  setLeader: (leader) => set({ leader }),
}));

const PlayerListStore: React.FC = () => {
  const { members, leader, addMember, setLeader } = usePlayerListStore();

  return (
    <div>
      <h2>Player List</h2>
      <ul>
        {members.map((member, index) => (
          <li key={index}>{member}</li>
        ))}
      </ul>
      <p>Leader: {leader}</p>
      <button onClick={() => addMember('New Member')}>Add Member</button>
      <button onClick={() => setLeader(1)}>Set Leader</button>
    </div>
  );
};

export default PlayerListStore;