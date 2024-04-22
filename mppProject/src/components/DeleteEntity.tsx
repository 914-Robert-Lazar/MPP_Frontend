import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Exercise from '../model/Exercise';
import localForage from 'localforage';

export function DeleteDialog({deleteDialogOpen, setDeleteDialogOpen, selectedRow, backendUrl, deleteUrl, setExercises, status, exerciseId} : 
    {deleteDialogOpen: boolean, setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>, 
        selectedRow: number, backendUrl: string, deleteUrl: string, setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>,
        status: string, exerciseId: number}) {
            
    function handleClose() {
        setDeleteDialogOpen(false);
    }

    async function  handleConfirmedDelete() {
        if (status == "OK") {
            await fetch(`${deleteUrl}/${selectedRow}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json'}
            })
            .catch(error => console.error("Error fetching delete", error));
            
            await fetch(backendUrl, {
                method: 'GET'
            })
            .then(response => response.json())
            .then(data => {
                setExercises(data);
            })
            .catch(error => console.error("Error fetching delete", error))
        }
        else {
            let cachedExercises: Exercise[] | null = await localForage.getItem("exercises");
            if (deleteUrl == "http://localhost:8080/api/exercises") {
                cachedExercises = cachedExercises!.filter((exercise) => exercise.id != selectedRow);
                
            }
            else {
                for (let i = 0; i < cachedExercises!.length; ++i) {
                    if (cachedExercises![i].id == exerciseId) {
                        cachedExercises![i].muscles = cachedExercises![i].muscles.filter((muscle) => muscle.id != selectedRow);
                        break;
                    }
                }
            }
            setExercises(cachedExercises!);
            localForage.setItem("exercises", cachedExercises);
        }
        setDeleteDialogOpen(false);
    }

    // useEffect(() => {
    //     handleConfirmedDelete();
    // }, []);

    return (
        <div>
            <Dialog open={deleteDialogOpen} onClose={handleClose}>
                <DialogTitle id="alert-dialog-title">
                    {"Confirm delete"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this item?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <button onClick={handleClose}>Cancel</button>
                    <button onClick={handleConfirmedDelete} autoFocus>Yes</button>
                </DialogActions>
            </Dialog>
        </div>
    )
}