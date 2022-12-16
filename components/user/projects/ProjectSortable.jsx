import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import Sortable from "sortablejs";
import { useAuth } from "../../../hooks/useAuth";
import { projectOrderService } from "../../../services/project";

export default function ProjectSortable({ children }) {
    const divRef = useRef();
    const { user } = useAuth();
    useEffect(() => {
        if (!divRef.current) return;
        if (!user?.account_details._id) return;
        var sortable = new Sortable(divRef.current, {
            group: "sortable-group",
            onSort: async (event) => {
                const old_index = event.oldIndex;
                const new_index = event.newIndex;
                try {
                    const response = await projectOrderService(old_index + 1, new_index + 1, user?.account_details._id);
                    toast.success("Priority changed.");
                } catch (e) {
                    toast.error("Some error occured.");
                }
            }
        })
    }, [divRef.current, user])
    return (
        <div ref={divRef}>
            {
                children
            }
        </div>
    )
}