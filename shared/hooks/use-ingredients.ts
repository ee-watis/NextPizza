import { Api } from "@/shared/services/api-client";
import { Ingredient } from "@prisma/client"
import React from "react"

export const useIngredients = () => {
    const [ingredients, setIngredints] = React.useState<Ingredient[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchIngradients() {
            try {
                setLoading(true);
                const ingredints = await Api.ingredients.getAll();
                setIngredints(ingredints);
              }
              catch (error) {
                console.log(error);
              }
              finally {
                setLoading(false);
              }
        }
        fetchIngradients();
    }, []);

    return {ingredients, loading};

}