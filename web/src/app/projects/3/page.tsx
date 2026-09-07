import BasePage from "@/components/BasePage";
import {projectData} from "@/data/projects";

export default function Page(){
    const data = projectData.find((item) => item.id == 3);
    return (
        <BasePage
            projectData={data!}

        >
            <>
                <p>Not Implemented</p>
            </>
        </BasePage>
    )
}